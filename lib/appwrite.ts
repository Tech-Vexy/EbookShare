import { Client, Account, Databases, Storage, Query } from "appwrite"

const requiredEnvVars = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_EBOOKS_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_EBOOKS_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_DOWNLOADS_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_DOWNLOADS_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_EBOOKS_BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_EBOOKS_BUCKET_ID,
  NEXT_PUBLIC_APPWRITE_COVER_IMAGES_BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_COVER_IMAGES_BUCKET_ID,
}

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

export const isAppwriteConfigured = missingEnvVars.length === 0

if (!isAppwriteConfigured) {
  console.warn("⚠️ Appwrite Configuration Missing:")
  console.warn("Missing environment variables:", missingEnvVars)
  console.warn("Please set up your Appwrite environment variables to enable full functionality.")
  console.warn("See APPWRITE_SETUP.md for detailed setup instructions.")
}

const client = new Client()

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "demo-project")

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "demo-database"
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users"
export const EBOOKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EBOOKS_COLLECTION_ID || "ebooks"
export const DOWNLOADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_DOWNLOADS_COLLECTION_ID || "downloads"
export const CATEGORIES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || "categories"

// Storage bucket IDs
export const EBOOKS_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_EBOOKS_BUCKET_ID || "ebooks"
export const COVER_IMAGES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_COVER_IMAGES_BUCKET_ID || "cover-images"

export { Query }
export default client
