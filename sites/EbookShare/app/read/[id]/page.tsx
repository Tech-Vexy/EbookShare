"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ReadingInterface } from "@/components/reader/reading-interface"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { PageSkeleton } from "@/components/ui/skeletons"
import { ebookService } from "@/lib/ebook-service"
import { useAuth } from "@/hooks/use-auth"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ebook } from "@/lib/database-schema"

export default function ReadingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ebookId = params.id as string

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push(`/auth?redirect=/read/${ebookId}`)
      return
    }

    loadEbookForReading()
  }, [ebookId, user, authLoading, router])

  const loadEbookForReading = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get ebook details
      const ebookData = await ebookService.getEbookById(ebookId)
      setEbook(ebookData)

      // Get file URL for reading
      if (ebookData.fileId) {
        try {
          const url = await ebookService.getFileDownloadUrl(ebookData.fileId)
          setFileUrl(url)
        } catch (fileError) {
          console.error('Failed to get file URL:', fileError)
          setError('Unable to load the ebook file for reading. The file may have been moved or deleted.')
          return
        }
      } else {
        setError('This ebook does not have an associated file.')
        return
      }

    } catch (err) {
      console.error('Failed to load ebook:', err)
      setError('Unable to load the ebook. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return <PageSkeleton />
  }

  if (error || !ebook || !fileUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Unable to Open Ebook</CardTitle>
            <CardDescription>
              {error || 'The ebook you requested could not be found or loaded.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => router.push('/catalog')}
                className="w-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Catalog
              </Button>
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-6">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Reading Error</h2>
            <p className="text-muted-foreground mb-4">
              There was an issue with the reading interface. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </Card>
        </div>
      }
    >
      <ReadingInterface 
        ebook={ebook} 
        fileUrl={fileUrl}
      />
    </ErrorBoundary>
  )
}
