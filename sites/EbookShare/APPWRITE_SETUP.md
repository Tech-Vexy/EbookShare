# Appwrite Database Setup Guide

## Required Environment Variables

First, add these environment variables to your Vercel project:

\`\`\`
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_EBOOKS_COLLECTION_ID=ebooks
NEXT_PUBLIC_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
NEXT_PUBLIC_APPWRITE_EBOOKS_BUCKET_ID=ebooks
\`\`\`

## Step-by-Step Setup

### 1. Create Appwrite Project
1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Copy the Project ID to `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

### 2. Create Database
1. Go to Databases in your Appwrite console
2. Create a new database called "ebook-platform"
3. Copy the Database ID to `NEXT_PUBLIC_APPWRITE_DATABASE_ID`

### 3. Create Collections

#### Users Collection
1. Create collection with ID: `users`
2. Add these attributes:
   - `email` (String, 255, Required)
   - `name` (String, 255, Required)
   - `avatar` (String, 500, Optional)
   - `bio` (String, 1000, Optional)
   - `role` (Enum: ["user", "admin"], Required, Default: "user")
   - `uploadCount` (Integer, Required, Default: 0)
   - `downloadCount` (Integer, Required, Default: 0)

#### Categories Collection
1. Create collection with ID: `categories`
2. Add these attributes:
   - `name` (String, 100, Required)
   - `slug` (String, 100, Required)
   - `description` (String, 500, Optional)
   - `color` (String, 7, Required, Default: "#6366f1")
   - `ebookCount` (Integer, Required, Default: 0)

#### Ebooks Collection
1. Create collection with ID: `ebooks`
2. Add these attributes:
   - `title` (String, 255, Required)
   - `author` (String, 255, Required)
   - `description` (String, 2000, Required)
   - `fileId` (String, 255, Required)
   - `fileName` (String, 255, Required)
   - `fileSize` (Integer, Required)
   - `coverImage` (String, 500, Optional)
   - `categoryId` (String, 255, Required)
   - `uploaderId` (String, 255, Required)
   - `downloadCount` (Integer, Required, Default: 0)
   - `tags` (String Array, 1000, Optional)
   - `isbn` (String, 20, Optional)
   - `publishedYear` (Integer, Optional)
   - `language` (String, 10, Required, Default: "en")
   - `status` (Enum: ["active", "pending", "rejected"], Required, Default: "pending")

#### Downloads Collection
1. Create collection with ID: `downloads`
2. Add these attributes:
   - `userId` (String, 255, Required)
   - `ebookId` (String, 255, Required)
   - `downloadedAt` (DateTime, Required)

### 4. Create Storage Bucket
1. Go to Storage in your Appwrite console
2. Create a new bucket with ID: `ebooks`
3. Set file size limit to 50MB
4. Allow file extensions: pdf
5. Set permissions to allow authenticated users to create/read

### 5. Set Permissions

#### Users Collection
- Read: `users` (authenticated users can read user data)
- Create: `users` (authenticated users can create profiles)
- Update: `users` (authenticated users can update their own data)
- Delete: `users` (authenticated users can delete their own data)

#### Categories Collection
- Read: `any` (public read access)
- Create: `users` (authenticated users can create categories)
- Update: `users` (authenticated users can update categories)
- Delete: `users` (authenticated users can delete categories)

#### Ebooks Collection
- Read: `any` (public read access)
- Create: `users` (authenticated users can upload ebooks)
- Update: `users` (authenticated users can update their ebooks)
- Delete: `users` (authenticated users can delete their ebooks)

#### Downloads Collection
- Read: `users` (users can read their own downloads)
- Create: `users` (users can create download records)
- Update: `users` (users can update their downloads)
- Delete: `users` (users can delete their downloads)

### 6. Authentication Setup
1. Go to Auth in your Appwrite console
2. Enable Email/Password authentication
3. Configure your domain in the allowed origins

## Initial Data

After setup, you can add some initial categories through the Appwrite console or by using the upload form in the application.

## Troubleshooting

- Make sure all environment variables are set correctly
- Verify collection IDs match exactly (case-sensitive)
- Check that permissions are set properly
- Ensure your domain is added to allowed origins in Appwrite
\`\`\`

```tsx file="" isHidden
