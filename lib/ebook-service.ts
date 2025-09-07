import {
  databases,
  storage,
  DATABASE_ID,
  EBOOKS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
  EBOOKS_BUCKET_ID,
  COVER_IMAGES_BUCKET_ID,
  Query,
} from "./appwrite"
import { ID } from "appwrite"
import type { Ebook, Category } from "./database-schema"

export class EbookService {
  // Upload file to storage
  async uploadFile(file: File): Promise<string> {
    try {
      const response = await storage.createFile(EBOOKS_BUCKET_ID, ID.unique(), file)
      return response.$id
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  // Upload cover image to storage
  async uploadCoverImage(image: File): Promise<string> {
    try {
      const response = await storage.createFile(COVER_IMAGES_BUCKET_ID, ID.unique(), image)
      return response.$id
    } catch (error) {
      console.error("Error uploading cover image:", error)
      throw error
    }
  }

  // Get cover image URL from storage
  getCoverImageUrl(coverImageId: string): string {
    try {
      return storage.getFileView(COVER_IMAGES_BUCKET_ID, coverImageId)
    } catch (error) {
      console.error("Error getting cover image URL:", error)
      return "/placeholder.jpg" // fallback to placeholder
    }
  }

  // Create ebook record in database
  async createEbook(ebookData: {
    title: string
    author: string
    description: string
    fileId: string
    fileName: string
    fileSize: number
    categoryId: string
    uploaderId: string
    tags: string[]
    isbn?: string
    publishedYear?: number
    language: string
    coverImageId?: string
  }): Promise<Ebook> {
    try {
      // Create the ebook document
      const response = await databases.createDocument(DATABASE_ID, EBOOKS_COLLECTION_ID, ID.unique(), {
        ...ebookData,
        downloadCount: 0,
        status: "active",
      })

      // Increment the category's ebook count
      await this.incrementCategoryCount(ebookData.categoryId)

      return {
        title: response.title,
        author: response.author,
        description: response.description,
        fileId: response.fileId,
        fileName: response.fileName,
        fileSize: response.fileSize,
        coverImageId: response.coverImageId,
        categoryId: response.categoryId,
        uploaderId: response.uploaderId,
        tags: response.tags,
        isbn: response.isbn,
        publishedYear: response.publishedYear,
        language: response.language,
        downloadCount: response.downloadCount,
        status: response.status,
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
      }
    } catch (error) {
      console.error("Error creating ebook:", error)
      throw error
    }
  }

  private async checkCollectionsExist(): Promise<boolean> {
    try {
      // Try to list documents from categories collection to test connectivity
      await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [Query.limit(1)])
      return true
    } catch (error: any) {
      if (error.code === 404) {
        console.error("❌ Appwrite collections not found. Please run the setup script first.")
        console.error("📖 See APPWRITE_SETUP.md for detailed setup instructions.")
        return false
      }
      if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
        console.error("❌ Network error: Unable to connect to Appwrite. This might be caused by:")
        console.error("   • Browser extension blocking requests (try disabling ad blockers)")
        console.error("   • Network connectivity issues")
        console.error("   • Incorrect Appwrite endpoint configuration")
        throw new Error("Unable to connect to Appwrite. Please check your network connection and disable any ad blockers.")
      }
      throw error
    }
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const collectionsExist = await this.checkCollectionsExist()
      if (!collectionsExist) {
        throw new Error("Collections not found. Please complete Appwrite setup first.")
      }

      const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [Query.orderAsc("name")])
      return response.documents.map((doc: any) => ({
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        color: doc.color,
        ebookCount: doc.ebookCount,
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  // Create category
  async createCategory(categoryData: {
    name: string
    slug: string
    description?: string
    color: string
  }): Promise<Category> {
    try {
      const response = await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, ID.unique(), {
        ...categoryData,
        ebookCount: 0,
      })
      return {
        name: response.name,
        slug: response.slug,
        description: response.description,
        color: response.color,
        ebookCount: response.ebookCount,
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
      }
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  }

  // Update category
  async updateCategory(categoryId: string, categoryData: {
    name?: string
    slug?: string
    description?: string
    color?: string
  }): Promise<Category> {
    try {
      const response = await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId, categoryData)
      return {
        name: response.name,
        slug: response.slug,
        description: response.description,
        color: response.color,
        ebookCount: response.ebookCount,
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
      }
    } catch (error) {
      console.error("Error updating category:", error)
      throw error
    }
  }

  // Delete category
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId)
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  }

  // Helper method to increment category ebook count
  private async incrementCategoryCount(categoryId: string): Promise<void> {
    try {
      // Get current category to read the current count
      const category = await databases.getDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId)
      const currentCount = category.ebookCount || 0
      
      // Update with incremented count
      await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId, {
        ebookCount: currentCount + 1
      })
      
      console.log(`✅ Incremented category ${categoryId} book count to ${currentCount + 1}`)
    } catch (error) {
      console.error("Error incrementing category count:", error)
      // Don't throw error to prevent ebook creation failure
      // Log the error but continue with ebook creation
    }
  }

  // Helper method to decrement category ebook count
  private async decrementCategoryCount(categoryId: string): Promise<void> {
    try {
      // Get current category to read the current count
      const category = await databases.getDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId)
      const currentCount = category.ebookCount || 0
      
      // Update with decremented count (but not below 0)
      const newCount = Math.max(0, currentCount - 1)
      await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, categoryId, {
        ebookCount: newCount
      })
      
      console.log(`✅ Decremented category ${categoryId} book count to ${newCount}`)
    } catch (error) {
      console.error("Error decrementing category count:", error)
      // Don't throw error to prevent ebook deletion failure
    }
  }

  // Get ebooks by user
  async getEbooksByUser(userId: string): Promise<Ebook[]> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, EBOOKS_COLLECTION_ID, [
        Query.equal("uploaderId", userId),
        Query.orderDesc("$createdAt"),
      ])
      return response.documents.map((doc: any) => ({
        title: doc.title,
        author: doc.author,
        description: doc.description,
        fileId: doc.fileId,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        categoryId: doc.categoryId,
        uploaderId: doc.uploaderId,
        tags: doc.tags,
        isbn: doc.isbn,
        publishedYear: doc.publishedYear,
        language: doc.language,
        downloadCount: doc.downloadCount,
        status: doc.status,
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching user ebooks:", error)
      throw error
    }
  }

  // Get all active ebooks with search and filtering
  async getEbooks(
    options: {
      search?: string
      categoryId?: string
      sortBy?: "newest" | "oldest" | "downloads" | "title"
      limit?: number
      offset?: number
    } = {},
  ): Promise<{ ebooks: Ebook[]; total: number }> {
    try {
      const queries = [Query.equal("status", "active")]

      // Add search query
      if (options.search) {
        queries.push(Query.search("title", options.search))
      }

      // Add category filter
      if (options.categoryId) {
        queries.push(Query.equal("categoryId", options.categoryId))
      }

      // Add sorting
      switch (options.sortBy) {
        case "oldest":
          queries.push(Query.orderAsc("$createdAt"))
          break
        case "downloads":
          queries.push(Query.orderDesc("downloadCount"))
          break
        case "title":
          queries.push(Query.orderAsc("title"))
          break
        default:
          queries.push(Query.orderDesc("$createdAt"))
      }

      // Add pagination
      if (options.limit) {
        queries.push(Query.limit(options.limit))
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset))
      }

      const response = await databases.listDocuments(DATABASE_ID, EBOOKS_COLLECTION_ID, queries)
      return {
        ebooks: response.documents.map((doc: any) => ({
          title: doc.title,
          author: doc.author,
          description: doc.description,
          fileId: doc.fileId,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          coverImageId: doc.coverImageId,
          categoryId: doc.categoryId,
          uploaderId: doc.uploaderId,
          tags: doc.tags,
          isbn: doc.isbn,
          publishedYear: doc.publishedYear,
          language: doc.language,
          downloadCount: doc.downloadCount,
          status: doc.status,
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
        })),
        total: response.total,
      }
    } catch (error) {
      console.error("Error fetching ebooks:", error)
      throw error
    }
  }

  // Get featured/popular ebooks
  async getFeaturedEbooks(limit = 6): Promise<Ebook[]> {
    try {
      const collectionsExist = await this.checkCollectionsExist()
      if (!collectionsExist) {
        throw new Error("Collections not found. Please complete Appwrite setup first.")
      }

      const response = await databases.listDocuments(DATABASE_ID, EBOOKS_COLLECTION_ID, [
        Query.equal("status", "active"),
        Query.orderDesc("downloadCount"),
        Query.limit(limit),
      ])
      return response.documents.map((doc: any) => ({
        title: doc.title,
        author: doc.author,
        description: doc.description,
        fileId: doc.fileId,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        categoryId: doc.categoryId,
        uploaderId: doc.uploaderId,
        tags: doc.tags,
        isbn: doc.isbn,
        publishedYear: doc.publishedYear,
        language: doc.language,
        downloadCount: doc.downloadCount,
        status: doc.status,
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching featured ebooks:", error)
      throw error
    }
  }

  // Get ebook by ID
  async getEbookById(id: string): Promise<Ebook> {
    try {
      const response = await databases.getDocument(DATABASE_ID, EBOOKS_COLLECTION_ID, id)
      return {
        title: response.title,
        author: response.author,
        description: response.description,
        fileId: response.fileId,
        fileName: response.fileName,
        fileSize: response.fileSize,
        coverImageId: response.coverImageId,
        categoryId: response.categoryId,
        uploaderId: response.uploaderId,
        tags: response.tags,
        isbn: response.isbn,
        publishedYear: response.publishedYear,
        language: response.language,
        downloadCount: response.downloadCount,
        status: response.status,
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
      }
    } catch (error) {
      console.error("Error fetching ebook:", error)
      throw error
    }
  }

  // Get related ebooks by category
  async getRelatedEbooks(categoryId: string, excludeId: string, limit = 4): Promise<Ebook[]> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, EBOOKS_COLLECTION_ID, [
        Query.equal("status", "active"),
        Query.equal("categoryId", categoryId),
        Query.notEqual("$id", excludeId),
        Query.orderDesc("downloadCount"),
        Query.limit(limit),
      ])
      return response.documents.map((doc: any) => ({
        title: doc.title,
        author: doc.author,
        description: doc.description,
        fileId: doc.fileId,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        categoryId: doc.categoryId,
        uploaderId: doc.uploaderId,
        tags: doc.tags,
        isbn: doc.isbn,
        publishedYear: doc.publishedYear,
        language: doc.language,
        downloadCount: doc.downloadCount,
        status: doc.status,
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching related ebooks:", error)
      throw error
    }
  }

  // Get file download URL
  getFileDownloadUrl(fileId: string): string {
  return storage.getFileDownload(EBOOKS_BUCKET_ID, fileId)
  }

  // Get file preview URL
  getFilePreviewUrl(fileId: string): string {
  return storage.getFilePreview(EBOOKS_BUCKET_ID, fileId)
  }
}

export const ebookService = new EbookService()
