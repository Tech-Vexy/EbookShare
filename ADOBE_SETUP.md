# Adobe PDF Embed API Setup Guide

## Getting Your Adobe Client ID

To use the in-app PDF reading feature, you need to get a free Adobe PDF Embed API Client ID.

### Step 1: Visit Adobe PDF Embed API
1. Go to https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html
2. Click on "Get started for free" or "Get credentials"

### Step 2: Create Adobe Developer Account
1. Sign in with your Adobe ID or create a new account
2. Accept the terms of service

### Step 3: Create a New Project
1. Once logged in, you'll be in the Adobe Developer Console
2. Click "Create new project"
3. Give your project a name (e.g., "EbookShare Platform")
4. Add the PDF Embed API to your project

### Step 4: Configure Your Project
1. Add your domain to the allowed domains list:
   - For development: `localhost:3000`
   - For production: `your-domain.com`
2. Copy your Client ID

### Step 5: Add Client ID to Your Environment
Add the following line to your `.env.local` file:

```bash
# Adobe PDF Embed API
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_client_id_here
```

## Usage Limits (Free Tier)
- 1,000 document transactions per day
- No watermarks
- Full feature access
- Perfect for development and small applications

## Important Notes
- The Client ID is public and safe to expose in client-side code
- For production apps with high traffic, consider Adobe's paid plans
- Keep your domains list updated in the Adobe Developer Console

## Testing
Once configured, you can test the PDF reader by:
1. Starting your development server: `npm run dev`
2. Uploading a PDF book
3. Clicking "Read Now" to open the in-app reader
