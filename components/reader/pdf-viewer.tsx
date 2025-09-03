"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  AlertCircle, 
  Maximize, 
  Minimize, 
  BookOpen,
  Eye,
  EyeOff,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Bookmark,
  StickyNote
} from "lucide-react"
import { useReadingProgress } from "@/hooks/use-reading-progress"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    AdobeDC: any
  }
}

interface PDFViewerProps {
  fileUrl: string
  fileName: string
  ebookId: string
  ebookTitle: string
  className?: string
  onPageChange?: (currentPage: number, totalPages: number) => void
  onReadingTimeUpdate?: (minutes: number) => void
}

export function PDFViewer({
  fileUrl,
  fileName,
  ebookId,
  ebookTitle,
  className,
  onPageChange,
  onReadingTimeUpdate,
}: PDFViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const adobeViewRef = useRef<any>(null)
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<Date | null>(null)
  const [isSDKReady, setIsSDKReady] = useState(false)

  const { updateProgress, addNote, addPageBookmark } = useReadingProgress()
  const { showSuccess, showError } = useToastNotifications()

  // Load Adobe PDF Embed API Script
  useEffect(() => {
    const loadAdobeSDK = () => {
      // Check if script is already loaded
      if (window.AdobeDC) {
        setIsSDKReady(true)
        return
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src="https://acrobatservices.adobe.com/view-sdk/viewer.js"]')
      if (existingScript) {
        // Add event listener for adobe_dc_view_sdk.ready
        document.addEventListener("adobe_dc_view_sdk.ready", function() {
          console.log("Adobe DC View SDK is ready")
          setIsSDKReady(true)
        })
        
        // Fallback check if event already fired
        const checkSDK = () => {
          if (window.AdobeDC) {
            setIsSDKReady(true)
          } else {
            setTimeout(checkSDK, 100)
          }
        }
        checkSDK()
        return
      }

      // Load the script
      const script = document.createElement('script')
      script.src = 'https://acrobatservices.adobe.com/view-sdk/viewer.js'
      script.type = 'text/javascript'
      
      script.onload = () => {
        console.log("Adobe PDF Embed API script loaded")
        
        // Listen for the adobe_dc_view_sdk.ready event
        document.addEventListener("adobe_dc_view_sdk.ready", function() {
          console.log("Adobe DC View SDK is ready")
          setIsSDKReady(true)
        })
        
        // Fallback timeout check
        const checkReady = () => {
          if (window.AdobeDC) {
            console.log("Adobe DC View SDK ready (fallback)")
            setIsSDKReady(true)
          } else {
            setTimeout(checkReady, 100)
          }
        }
        setTimeout(checkReady, 1000)
      }
      
      script.onerror = () => {
        console.error("Failed to load Adobe PDF Embed API script")
        setError('Failed to load Adobe PDF Embed API script')
        setIsLoading(false)
      }
      
      document.head.appendChild(script)
    }

    loadAdobeSDK()

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current)
      }
    }
  }, [])

  // Initialize PDF Viewer when SDK is ready
  useEffect(() => {
    if (!isSDKReady || !viewerRef.current || adobeViewRef.current) return

    const initializeViewer = () => {
      const clientId = process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID
      
      if (!clientId || clientId === "your_adobe_client_id_here") {
        setError("Adobe PDF Embed API Client ID is not configured. Please check your environment variables.")
        setIsLoading(false)
        return
      }

      try {
        console.log('Initializing Adobe PDF Viewer with:', { clientId, fileUrl, fileName })
        
        // Create the Adobe DC View instance
        const adobeDCView = new window.AdobeDC.View({
          clientId: clientId,
          divId: viewerRef.current!.id,
        })

        adobeViewRef.current = adobeDCView

        // Preview the PDF file
        adobeDCView.previewFile(
          {
            content: { location: { url: fileUrl } },
            metaData: { fileName: fileName }
          },
          {
            embedMode: "SIZED_CONTAINER",
            showAnnotationTools: true,
            showLeftHandPanel: true,
            showDownloadPDF: false,
            showPrintPDF: false,
            showZoomControl: true,
            defaultViewMode: "FIT_PAGE",
            enableFormFilling: false,
          }
        )

        // Register event listeners for PDF interactions
        adobeDCView.registerCallback(
          window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
          (event: any) => {
            handleAdobeEvent(event)
          },
          {
            enablePDFAnalytics: true,
            enableAnnotationEvents: true,
          }
        )

        setIsLoading(false)
        setIsReady(true)
        startReadingTimer()
        showSuccess(`PDF "${ebookTitle}" loaded successfully`)

      } catch (err) {
        console.error('PDF Viewer initialization error:', err)
        setError(`Failed to initialize PDF viewer: ${err}`)
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(initializeViewer, 100)
    return () => clearTimeout(timer)
  }, [isSDKReady, fileUrl, fileName, ebookTitle, showSuccess])

  const handleAdobeEvent = useCallback((event: any) => {
    console.log('Adobe PDF Event:', event)
    
    switch (event.type) {
      case 'PAGE_VIEW':
        const page = event.data.pageNumber
        const total = event.data.pdfInfo?.numPages || totalPages
        setCurrentPage(page)
        if (total > 0) {
          setTotalPages(total)
        }
        onPageChange?.(page, total || totalPages)
        
        // Update reading progress
        if ((total || totalPages) > 0) {
          updateProgress(ebookId, {
            currentPage: page,
            totalPages: total || totalPages,
          })
        }
        break

      case 'DOCUMENT_OPEN':
        const docPages = event.data.pdfInfo?.numPages || 0
        setTotalPages(docPages)
        console.log(`PDF document opened with ${docPages} pages`)
        break

      case 'ANNOTATION_ADDED':
        // Handle annotation as a note
        if (event.data.annotation?.contents) {
          addNote(ebookId, event.data.annotation.contents, currentPage)
        }
        break

      default:
        console.log('Unhandled Adobe event:', event.type)
        break
    }
  }, [ebookId, currentPage, totalPages, onPageChange, updateProgress, addNote])

  const startReadingTimer = useCallback(() => {
    setReadingStartTime(new Date())
    
    // Update reading time every minute
    readingTimerRef.current = setInterval(() => {
      if (readingStartTime) {
        const now = new Date()
        const minutesRead = Math.floor((now.getTime() - readingStartTime.getTime()) / (1000 * 60))
        if (minutesRead > 0) {
          onReadingTimeUpdate?.(minutesRead)
          updateProgress(ebookId, {
            readingTimeMinutes: minutesRead,
          })
        }
      }
    }, 60000) // Every minute
  }, [ebookId, readingStartTime, onReadingTimeUpdate, updateProgress])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const addBookmarkAtCurrentPage = useCallback(() => {
    if (currentPage > 0) {
      addPageBookmark(ebookId, currentPage)
    }
  }, [ebookId, currentPage, addPageBookmark])

  const downloadPDF = useCallback(() => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [fileUrl, fileName])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  if (error) {
    const isConfigError = error.includes("Client ID is not configured")
    
    return (
      <Card className={cn("p-8 text-center max-w-2xl mx-auto", className)}>
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isConfigError ? "Adobe PDF Embed API Not Configured" : "Unable to load PDF"}
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        
        {isConfigError && (
          <div className="bg-muted/30 p-4 rounded-lg mb-4 text-left">
            <h4 className="font-medium mb-2">Quick Setup:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Adobe PDF Embed API</a></li>
              <li>Get your free Client ID</li>
              <li>Add it to your .env.local file</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => window.open(fileUrl, '_blank')} variant="default">
            Open in Browser
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("relative h-full flex flex-col", className)}>
      {/* Reading Controls Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium truncate max-w-[200px]">{ebookTitle}</span>
          </div>
          {isReady && totalPages > 0 && (
            <Badge variant="outline" className="text-xs">
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={addBookmarkAtCurrentPage}
            disabled={!isReady || currentPage === 0}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadPDF}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isReady && totalPages > 0 && (
        <div className="px-4 py-2 bg-card/30 flex-shrink-0">
          <Progress 
            value={(currentPage / totalPages) * 100} 
            className="h-1"
          />
        </div>
      )}

      {/* PDF Viewer Container */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        <div
          ref={viewerRef}
          id={`adobe-dc-view-${ebookId}`}
          className={cn(
            "h-full w-full bg-white rounded-lg",
            isFullscreen && "fixed inset-0 z-50 bg-background min-h-screen"
          )}
        />
      </div>

      {/* Reading Time Indicator */}
      {readingStartTime && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground">
          Reading for {Math.floor((Date.now() - readingStartTime.getTime()) / (1000 * 60))} min
        </div>
      )}
    </div>
  )
}

// Fallback viewer for non-PDF files
export function GenericFileViewer({
  fileUrl,
  fileName,
  ebookTitle,
  className,
}: {
  fileUrl: string
  fileName: string
  ebookTitle: string
  className?: string
}) {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{ebookTitle}</h3>
      <p className="text-muted-foreground mb-4">
        This file format is not supported for in-browser reading.
      </p>
      <Button asChild>
        <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4 mr-2" />
          Download to Read
        </a>
      </Button>
    </Card>
  )
}
