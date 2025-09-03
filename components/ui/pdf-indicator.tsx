"use client"

import { Badge } from "@/components/ui/badge"
import { FileText, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PDFIndicatorProps {
  filename?: string
  variant?: "badge" | "button" | "minimal"
  className?: string
  showText?: boolean
}

export function PDFIndicator({ 
  filename, 
  variant = "badge", 
  className,
  showText = true 
}: PDFIndicatorProps) {
  const isPDF = filename?.toLowerCase().endsWith('.pdf') || filename?.toLowerCase().includes('.pdf')
  
  if (!isPDF) return null

  if (variant === "badge") {
    return (
      <Badge 
        variant="secondary" 
        className={cn("bg-red-500/90 text-white border-0 text-xs", className)}
      >
        <FileText className="h-3 w-3 mr-1" />
        {showText && "PDF"}
      </Badge>
    )
  }

  if (variant === "button") {
    return (
      <div className={cn("inline-flex items-center gap-1 text-red-600", className)}>
        <PlayCircle className="h-4 w-4" />
        {showText && <span className="text-sm font-medium">Read PDF</span>}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <FileText className={cn("h-3 w-3 text-red-500", className)} />
    )
  }

  return null
}

// Utility function to check if a file is PDF
export function isPDFFile(filename?: string): boolean {
  return filename?.toLowerCase().endsWith('.pdf') || filename?.toLowerCase().includes('.pdf') || false
}
