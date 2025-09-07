import {
  databases,
  DATABASE_ID,
  DOWNLOADS_COLLECTION_ID,
  EBOOKS_COLLECTION_ID,
  USERS_COLLECTION_ID,
  Query,
} from "./appwrite"
import { ID } from "appwrite"
import type { Download } from "./database-schema"

export class DownloadService {
  // Record a download
  async recordDownload(userId: string, ebookId: string): Promise<Download> {
    try {
      // Create download record
      const download = await databases.createDocument(DATABASE_ID, DOWNLOADS_COLLECTION_ID, ID.unique(), {
        userId,
        ebookId,
        downloadedAt: new Date().toISOString(),
      })

      // Update ebook download count
      const ebook = await databases.getDocument(DATABASE_ID, EBOOKS_COLLECTION_ID, ebookId)
      await databases.updateDocument(DATABASE_ID, EBOOKS_COLLECTION_ID, ebookId, {
        downloadCount: (ebook.downloadCount || 0) + 1,
      })

      // Update user download count
      try {
        const user = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId)
        await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
          downloadCount: (user.downloadCount || 0) + 1,
        })
      } catch (error) {
        // User document might not exist in our custom collection, that's okay
        console.log("User document not found in custom collection")
      }

      return download as Download
    } catch (error) {
      console.error("Error recording download:", error)
      throw error
    }
  }

  // Get user's download history
  async getUserDownloads(userId: string, limit?: number): Promise<Download[]> {
    try {
      const queries = [Query.equal("userId", userId), Query.orderDesc("downloadedAt")]

      if (limit) {
        queries.push(Query.limit(limit))
      }

      const response = await databases.listDocuments(DATABASE_ID, DOWNLOADS_COLLECTION_ID, queries)
      return response.documents as Download[]
    } catch (error) {
      console.error("Error fetching user downloads:", error)
      throw error
    }
  }

  // Get download statistics for user
  async getUserDownloadStats(userId: string): Promise<{
    totalDownloads: number
    recentDownloads: Download[]
    downloadsByMonth: { month: string; count: number }[]
  }> {
    try {
      const downloads = await this.getUserDownloads(userId)
      const recentDownloads = downloads.slice(0, 5)

      // Group downloads by month
      const downloadsByMonth = downloads.reduce(
        (acc, download) => {
          const month = new Date(download.downloadedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
          const existing = acc.find((item) => item.month === month)
          if (existing) {
            existing.count++
          } else {
            acc.push({ month, count: 1 })
          }
          return acc
        },
        [] as { month: string; count: number }[],
      )

      return {
        totalDownloads: downloads.length,
        recentDownloads,
        downloadsByMonth: downloadsByMonth.slice(0, 6), // Last 6 months
      }
    } catch (error) {
      console.error("Error fetching download stats:", error)
      throw error
    }
  }

  // Check if user has downloaded an ebook
  async hasUserDownloaded(userId: string, ebookId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, DOWNLOADS_COLLECTION_ID, [
        Query.equal("userId", userId),
        Query.equal("ebookId", ebookId),
        Query.limit(1),
      ])
      return response.documents.length > 0
    } catch (error) {
      console.error("Error checking download status:", error)
      return false
    }
  }
}

export const downloadService = new DownloadService()
