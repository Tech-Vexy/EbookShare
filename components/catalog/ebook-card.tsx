import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, User } from "lucide-react"
import Link from "next/link"
import type { Ebook, Category } from "@/lib/database-schema"

interface EbookCardProps {
  ebook: Ebook
  category?: Category
  showDownloadButton?: boolean
}

export function EbookCard({ ebook, category, showDownloadButton = true }: EbookCardProps) {
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

  return (
    <Card className="h-full flex flex-col hover-lift bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="text-xl font-sans leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {ebook.title}
          </CardTitle>
          {category && (
            <Badge variant="secondary" className="shrink-0 text-xs bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/20">
              {category.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="p-1 bg-primary/10 rounded-full">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="truncate font-medium">{ebook.author}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="line-clamp-3 mb-6 flex-1 text-base leading-relaxed">{ebook.description}</CardDescription>

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
                <span className="font-medium">{formatFileSize(ebook.fileSize)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-500/10 rounded-full">
                  <Download className="h-3 w-3 text-green-500" />
                </div>
                <span className="font-medium">{ebook.downloadCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-orange-500/10 rounded-full">
                <Calendar className="h-3 w-3 text-orange-500" />
              </div>
              <span className="font-medium">{formatDate(ebook.$createdAt)}</span>
            </div>
          </div>

          {/* Enhanced Action Button */}
          {showDownloadButton && (
            <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group">
              <Link href={`/ebook/${ebook.$id}`} className="flex items-center justify-center gap-2">
                <span>View Details</span>
                <Download className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
