import {
  databases,
  storage,
  DATABASE_ID,
  EBOOKS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
  EBOOKS_BUCKET_ID,
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
  }): Promise<Ebook> {
    try {
      const response = await databases.createDocument(DATABASE_ID, EBOOKS_COLLECTION_ID, ID.unique(), {
        ...ebookData,
        downloadCount: 0,
        status: "active",
      })
      return {
        title: response.title,
        author: response.author,
        description: response.description,
        fileId: response.fileId,
        fileName: response.fileName,
        fileSize: response.fileSize,
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
