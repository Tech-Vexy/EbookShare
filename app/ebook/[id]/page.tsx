"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, User, ArrowLeft, Loader2, BookOpen, Eye, PlayCircle, FileText } from "lucide-react"
import { ebookService } from "@/lib/ebook-service"
import { downloadService } from "@/lib/download-service"
import { EbookCard } from "@/components/catalog/ebook-card"
import type { Ebook, Category } from "@/lib/database-schema"
import Link from "next/link"

export default function EbookDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [relatedEbooks, setRelatedEbooks] = useState<Ebook[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

  // Check if file is PDF
  const isPDF = ebook?.fileName?.toLowerCase().endsWith('.pdf') || ebook?.fileName?.toLowerCase().includes('.pdf')

  useEffect(() => {
    if (params.id) {
      loadEbook(params.id as string)
    }
  }, [params.id, user])

  const loadEbook = async (id: string) => {
    try {
      setLoading(true)
      const [ebookData, categoriesData] = await Promise.all([
        ebookService.getEbookById(id),
        ebookService.getCategories(),
      ])

      setEbook(ebookData)
      setCategories(categoriesData)

      const ebookCategory = categoriesData.find((cat) => cat.$id === ebookData.categoryId)
      setCategory(ebookCategory || null)

      // Load related ebooks
      if (ebookCategory) {
        const related = await ebookService.getRelatedEbooks(ebookCategory.$id, id)
        setRelatedEbooks(related)
      }

      // Check if user has downloaded this ebook
      if (user) {
        const downloaded = await downloadService.hasUserDownloaded(user.$id, id)
        setHasDownloaded(downloaded)
      }
    } catch (error) {
      console.error("Failed to load ebook:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!ebook) return

    setDownloading(true)
    try {
      // Record download if user is logged in
      if (user) {
        await downloadService.recordDownload(user.$id, ebook.$id)
        setHasDownloaded(true)
      }

      // Start download
      const downloadUrl = ebookService.getFileDownloadUrl(ebook.fileId)
      window.open(downloadUrl, "_blank")
    } catch (error) {
      console.error("Failed to record download:", error)
      // Still allow download even if tracking fails
      const downloadUrl = ebookService.getFileDownloadUrl(ebook.fileId)
      window.open(downloadUrl, "_blank")
    } finally {
      setDownloading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Ebook Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The ebook you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>

          {/* Download Alert for Non-Authenticated Users */}
          {!user && (
            <Alert className="mb-6">
              <AlertDescription>
                <Link href="/auth" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>{" "}
                to track your downloads and get personalized recommendations.
              </AlertDescription>
            </Alert>
          )}

          {/* Ebook Details */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <CardTitle className="text-2xl font-sans leading-tight">{ebook.title}</CardTitle>
                    {category && (
                      <Badge variant="secondary" className="shrink-0">
                        {category.name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{ebook.author}</span>
                  </div>

                  <CardDescription className="text-base leading-relaxed">{ebook.description}</CardDescription>
                </div>

                <div className="lg:w-64 space-y-4">
                  {/* Read Now Button - Enhanced for PDF */}
                  <Button 
                    asChild 
                    size="lg" 
                    className={`w-full transition-all duration-300 ${
                      isPDF 
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25" 
                        : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    }`}
                  >
                    <Link href={`/read/${ebook.$id}`} className="flex items-center justify-center gap-2">
                      {isPDF ? (
                        <>
                          <PlayCircle className="h-5 w-5" />
                          <span className="font-semibold">Read PDF Now</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4" />
                          <span>Read Now</span>
                        </>
                      )}
                    </Link>
                  </Button>

                  {isPDF && (
                    <div className="text-center">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <FileText className="h-3 w-3 mr-1" />
                        Interactive PDF Reader
                      </Badge>
                    </div>
                  )}

                  {/* Download Button */}
                  <Button 
                    onClick={handleDownload} 
                    size="lg" 
                    variant="outline"
                    className="w-full" 
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>

                  {hasDownloaded && (
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        Previously Downloaded
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium">{formatFileSize(ebook.fileSize)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-medium">{ebook.downloadCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">{ebook.language.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Added:</span>
                      <span className="font-medium">{formatDate(ebook.$createdAt)}</span>
                    </div>
                    {ebook.publishedYear && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span className="font-medium">{ebook.publishedYear}</span>
                      </div>
                    )}
                    {ebook.isbn && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ISBN:</span>
                        <span className="font-medium font-mono text-xs">{ebook.isbn}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {ebook.tags && ebook.tags.length > 0 && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {ebook.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Related Ebooks */}
          {relatedEbooks.length > 0 && (
            <div>
              <h2 className="text-xl font-sans font-semibold mb-6">Related Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedEbooks.map((relatedEbook) => {
                  const relatedCategory = categories.find((cat) => cat.$id === relatedEbook.categoryId)
                  return <EbookCard key={relatedEbook.$id} ebook={relatedEbook} category={relatedCategory} />
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
