"use client"

import { PDFViewerTest } from "@/components/reader/pdf-viewer-test"

export default function PDFTestPage() {
  // Use a public PDF for testing
  const testFileUrl = "https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf"
  const testFileName = "Test PDF.pdf"

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Adobe PDF Embed API Test</h1>
        <PDFViewerTest 
          fileUrl={testFileUrl}
          fileName={testFileName}
        />
      </div>
    </div>
  )
}
