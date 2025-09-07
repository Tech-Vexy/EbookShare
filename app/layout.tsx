import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "EbookShare - Modern Ebook Sharing Platform",
    template: "%s | EbookShare"
  },
  description: "A modern, beautiful platform for computer science and software engineering students and professionals to share and discover essential ebooks. Built with Next.js, TypeScript, and Appwrite.",
  keywords: [
    "ebooks",
    "computer science",
    "software engineering",
    "programming",
    "books",
    "sharing",
    "platform",
    "education",
    "learning",
    "technical books"
  ],
  authors: [{ name: "EbookShare Team" }],
  creator: "EbookShare Team",
  publisher: "EbookShare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ebookshare.appwrite.network/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ebookshare.appwrite.network/",
    title: "EbookShare - Modern Ebook Sharing Platform",
    description: "Share and discover essential computer science and software engineering ebooks with our vibrant community.",
    siteName: "EbookShare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EbookShare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EbookShare - Modern Ebook Sharing Platform",
    description: "Share and discover essential computer science and software engineering ebooks with our vibrant community.",
    images: ["/og-image.png"],
    creator: "@EVeldrine",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#6366f1",
      },
    ],
  },
  manifest: "/site.webmanifest",
  generator: "Next.js",
  category: "education",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
            <Toaster 
              position="top-right" 
              expand={false}
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                classNames: {
                  toast: "glass",
                  title: "font-semibold",
                  description: "text-muted-foreground",
                  actionButton: "bg-primary text-primary-foreground",
                  cancelButton: "bg-muted text-muted-foreground",
                },
              }}
            />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
