"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkButton } from "@/components/catalog/bookmark-button"
import { ReadingProgressCard } from "@/components/dashboard/reading-progress"
import { PDFIndicator, isPDFFile } from "@/components/ui/pdf-indicator"
import { ebookService } from "@/lib/ebook-service"
import { downloadService } from "@/lib/download-service"
import { useAuth } from "@/hooks/use-auth"
import { 
  Download, 
  Eye, 
  Calendar, 
  FileText, 
  User,
  Clock,
  Star,
  BookOpen,
  PlayCircle,
  File
} from "lucide-react"
import type { Ebook, Category } from "@/lib/database-schema"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface EbookCardProps {
  ebook: Ebook
  category?: Category
  variant?: "default" | "compact" | "detailed"
  showProgress?: boolean
  showDownloadButton?: boolean
  className?: string
}

export function EbookCard({ 
  ebook, 
  category,
  variant = "default", 
  showProgress = false,
  showDownloadButton = true,
  className 
}: EbookCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { user } = useAuth()

  // Check if file is a PDF
  const isPDF = isPDFFile(ebook.fileName)

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRandomRating = () => {
    return (3.5 + Math.random() * 1.5).toFixed(1)
  }

  const getRandomDownloads = () => {
    return ebook.downloadCount || Math.floor(Math.random() * 10000) + 100
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDownloading(true)
    try {
      // Record download if user is logged in
      if (user) {
        await downloadService.recordDownload(user.$id, ebook.$id)
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

  if (variant === "compact") {
    return (
      <Card className={cn(
        "group overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative w-16 h-20 flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.jpg" : ebook.coverImage || "/placeholder.jpg"}
                alt={ebook.title}
                fill
                className="object-cover rounded-md"
                onError={() => setImageError(true)}
              />
              {isPDF && (
                <div className="absolute -top-1 -right-1">
                  <PDFIndicator filename={ebook.fileName} variant="badge" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {ebook.title}
                </h3>
                <p className="text-xs text-muted-foreground">{ebook.author}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <BookmarkButton ebook={ebook} variant="minimal" />
                  {isPDF ? (
                    <Link href={`/read/${ebook.$id}`}>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs bg-red-500/10 text-red-600 hover:bg-red-500/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Read
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/ebook/${ebook.$id}`}>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        View
                      </Button>
                    </Link>
                  )}
                  {showDownloadButton && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>{getRandomDownloads()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "detailed") {
    return (
      <Card className={cn(
        "group overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2",
        className
      )}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageError ? "/placeholder.jpg" : ebook.coverImage || "/placeholder.jpg"}
            alt={ebook.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* PDF Click to Read Overlay */}
          {isPDF && (
            <Link href={`/read/${ebook.$id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 cursor-pointer">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-transform duration-200">
                <PlayCircle className="h-4 w-4" />
                Click to Read PDF
              </div>
            </Link>
          )}
          
          {/* Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <BookmarkButton ebook={ebook} variant="minimal" className="bg-white/90 text-gray-900 hover:bg-white" />
            {showDownloadButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 bg-white/90 text-gray-900 hover:bg-white"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Link href={`/ebook/${ebook.$id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90 text-gray-900 hover:bg-white">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isPDF && (
              <Badge variant="secondary" className="bg-red-500/90 text-white border-0 text-xs">
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" className="bg-black/60 text-white border-0 text-xs">
                {category.name}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Title and Author */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {ebook.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{ebook.author}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{formatFileSize(ebook.fileSize || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{getRandomDownloads()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{getRandomRating()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(ebook.$createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          {ebook.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {ebook.description}
            </p>
          )}

          {/* Tags */}
          {ebook.tags && ebook.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ebook.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {ebook.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{ebook.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Progress Card */}
          {showProgress && (
            <ReadingProgressCard
              ebookId={ebook.$id}
              ebookTitle={ebook.title}
              className="mt-4"
            />
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link href={`/read/${ebook.$id}`} className="flex-1">
              <Button className="w-full" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Now
              </Button>
            </Link>
            {showDownloadButton && (
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <BookmarkButton ebook={ebook} variant="minimal" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant - Enhanced version of the original
  return (
    <Card className={cn(
      "h-full flex flex-col hover-lift bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 group",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="text-xl font-sans leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {ebook.title}
          </CardTitle>
          <div className="flex gap-2 shrink-0">
            {category && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/20">
                {category.name}
              </Badge>
            )}
            <BookmarkButton ebook={ebook} variant="minimal" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="p-1 bg-primary/10 rounded-full">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="truncate font-medium">{ebook.author}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="line-clamp-3 mb-6 flex-1 text-base leading-relaxed">
          {ebook.description}
        </CardDescription>

        <div className="space-y-4">
          {/* Tags */}
          {ebook.tags && ebook.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ebook.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/30 text-secondary hover:bg-secondary/20 transition-colors">
                  {tag}
                </Badge>
              ))}
              {ebook.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary">
                  +{ebook.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Enhanced Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-500/10 rounded-full">
                  <FileText className="h-3 w-3 text-blue-500" />
                </div>
                <span className="font-medium">{formatFileSize(ebook.fileSize || 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-500/10 rounded-full">
                  <Download className="h-3 w-3 text-green-500" />
                </div>
                <span className="font-medium">{getRandomDownloads()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-orange-500/10 rounded-full">
                <Calendar className="h-3 w-3 text-orange-500" />
              </div>
              <span className="font-medium">{formatDate(ebook.$createdAt)}</span>
            </div>
          </div>

          {/* Reading Progress */}
          {showProgress && (
            <ReadingProgressCard
              ebookId={ebook.$id}
              ebookTitle={ebook.title}
              className="mt-3"
            />
          )}

          {/* Enhanced Action Button */}
          {showDownloadButton && (
            <div className="flex gap-2">
              <Button 
                asChild 
                className={cn(
                  "flex-1 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group",
                  isPDF 
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                    : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                )}
              >
                <Link href={`/read/${ebook.$id}`} className="flex items-center justify-center gap-2">
                  {isPDF ? (
                    <>
                      <PlayCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Read PDF</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>Read Now</span>
                    </>
                  )}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/ebook/${ebook.$id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
