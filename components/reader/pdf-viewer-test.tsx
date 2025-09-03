"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

declare global {
  interface Window {
    AdobeDC: any
  }
}

interface PDFViewerTestProps {
  fileUrl: string
  fileName: string
}

export function PDFViewerTest({ fileUrl, fileName }: PDFViewerTestProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog("Starting PDF viewer test...")
    
    // Check if Adobe SDK is already loaded
    if (window.AdobeDC) {
      addLog("Adobe SDK already loaded")
      initializeViewer()
      return
    }

    addLog("Loading Adobe SDK script...")
    
    // Load Adobe SDK script
    const script = document.createElement('script')
    script.src = 'https://acrobatservices.adobe.com/view-sdk/viewer.js'
    script.type = 'text/javascript'
    
    script.onload = () => {
      addLog("Adobe SDK script loaded")
      
      // Wait for SDK to be ready with adobe_dc_view_sdk.ready event
      document.addEventListener("adobe_dc_view_sdk.ready", function() {
        addLog("Adobe SDK ready event fired")
        initializeViewer()
      })
      
      // Fallback timeout check
      setTimeout(() => {
        if (window.AdobeDC) {
          addLog("Adobe SDK ready (fallback check)")
          initializeViewer()
        } else {
          addLog("Adobe SDK not ready after timeout")
          setError("Adobe SDK failed to initialize")
          setIsLoading(false)
        }
      }, 5000)
    }
    
    script.onerror = () => {
      addLog("Failed to load Adobe SDK script")
      setError("Failed to load Adobe PDF Embed API script")
      setIsLoading(false)
    }
    
    document.head.appendChild(script)
  }, [])

  const initializeViewer = () => {
    if (!viewerRef.current) {
      addLog("Viewer ref not available")
      return
    }

    const clientId = process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID
    addLog(`Client ID: ${clientId ? 'Present' : 'Missing'}`)
    
    if (!clientId || clientId === "your_adobe_client_id_here") {
      setError("Adobe PDF Embed API Client ID is not configured")
      setIsLoading(false)
      return
    }

    try {
      addLog("Creating Adobe DC View...")
      
      const adobeDCView = new window.AdobeDC.View({
        clientId: clientId,
        divId: viewerRef.current.id,
      })

      addLog("Adobe DC View created, previewing file...")
      addLog(`File URL: ${fileUrl}`)
      addLog(`File Name: ${fileName}`)

      adobeDCView.previewFile(
        {
          content: { location: { url: fileUrl } },
          metaData: { fileName: fileName }
        },
        {
          embedMode: "SIZED_CONTAINER",
          showDownloadPDF: false,
          showPrintPDF: false,
        }
      )

      addLog("Preview file called successfully")
      setIsLoading(false)

    } catch (err) {
      addLog(`Error initializing viewer: ${err}`)
      setError(`Failed to initialize PDF viewer: ${err}`)
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="p-6">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-center">PDF Viewer Test Failed</h3>
        <p className="text-red-600 mb-4 text-center">{error}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Debug Logs:</h4>
          <div className="text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <Card className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading PDF viewer...</p>
        </Card>
      )}
      
      <div
        ref={viewerRef}
        id="adobe-dc-view-test"
        className="min-h-[600px] w-full border rounded-lg"
      />
      
      <Card className="p-4">
        <h4 className="font-medium mb-2">Debug Logs:</h4>
        <div className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}
