"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"
import { ebookService } from "@/lib/ebook-service"

export function SetupBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkSetup() {
      try {
        await ebookService.getCategories()
        setShowBanner(false)
      } catch (error) {
        setShowBanner(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkSetup()
  }, [])

  if (isChecking || !showBanner) {
    return null
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertDescription className="text-sm">
            <strong>Setup Required:</strong> Appwrite collections are not configured yet. Please follow the setup guide
            to create the required database collections.
          </AlertDescription>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-amber-300 text-amber-800 hover:bg-amber-100 bg-transparent"
              onClick={() => window.open("/APPWRITE_SETUP.md", "_blank")}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Setup Guide
            </Button>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
          onClick={() => setShowBanner(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Alert>
  )
}
