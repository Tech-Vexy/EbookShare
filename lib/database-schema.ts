export interface User {
  $id: string
  $createdAt: string
  $updatedAt: string
  email: string
  name: string
  avatar?: string
  bio?: string
  role: "user" | "admin"
  uploadCount: number
  downloadCount: number
}

export interface Category {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  slug: string
  description?: string
  color: string
  ebookCount: number
}

export interface Ebook {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  author: string
  description: string
  fileId: string
  fileName: string
  fileSize: number
  coverImage?: string
  categoryId: string
  uploaderId: string
  downloadCount: number
  tags: string[]
  isbn?: string
  publishedYear?: number
  language: string
  status: "active" | "pending" | "rejected"
}

export interface Download {
  $id: string
  $createdAt: string
  $updatedAt: string
  userId: string
  ebookId: string
  downloadedAt: string
}

// Collection attributes for Appwrite setup
export const COLLECTION_SCHEMAS = {
  users: [
    { key: "email", type: "string", size: 255, required: true },
    { key: "name", type: "string", size: 255, required: true },
    { key: "avatar", type: "string", size: 500, required: false },
    { key: "bio", type: "string", size: 1000, required: false },
    { key: "role", type: "enum", elements: ["user", "admin"], required: true, default: "user" },
    { key: "uploadCount", type: "integer", required: true, default: 0 },
    { key: "downloadCount", type: "integer", required: true, default: 0 },
  ],
  categories: [
    { key: "name", type: "string", size: 100, required: true },
    { key: "slug", type: "string", size: 100, required: true },
    { key: "description", type: "string", size: 500, required: false },
    { key: "color", type: "string", size: 7, required: true, default: "#6366f1" },
    { key: "ebookCount", type: "integer", required: true, default: 0 },
  ],
  ebooks: [
    { key: "title", type: "string", size: 255, required: true },
    { key: "author", type: "string", size: 255, required: true },
    { key: "description", type: "string", size: 2000, required: true },
    { key: "fileId", type: "string", size: 255, required: true },
    { key: "fileName", type: "string", size: 255, required: true },
    { key: "fileSize", type: "integer", required: true },
    { key: "coverImage", type: "string", size: 500, required: false },
    { key: "categoryId", type: "string", size: 255, required: true },
    { key: "uploaderId", type: "string", size: 255, required: true },
    { key: "downloadCount", type: "integer", required: true, default: 0 },
    { key: "tags", type: "string", size: 1000, required: false, array: true },
    { key: "isbn", type: "string", size: 20, required: false },
    { key: "publishedYear", type: "integer", required: false },
    { key: "language", type: "string", size: 10, required: true, default: "en" },
    { key: "status", type: "enum", elements: ["active", "pending", "rejected"], required: true, default: "pending" },
  ],
  downloads: [
    { key: "userId", type: "string", size: 255, required: true },
    { key: "ebookId", type: "string", size: 255, required: true },
    { key: "downloadedAt", type: "datetime", required: true },
  ],
}
