"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Calendar } from "lucide-react"
import type { Ebook, Download as DownloadType } from "@/lib/database-schema"

interface RecentActivityProps {
  recentUploads: Ebook[]
  recentDownloads: DownloadType[]
  ebooks: Ebook[]
}

export function RecentActivity({ recentUploads, recentDownloads, ebooks }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Recent Uploads
          </CardTitle>
          <CardDescription>Your latest book contributions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No uploads yet</p>
          ) : (
            <div className="space-y-4">
              {recentUploads.slice(0, 5).map((ebook) => (
                <div key={ebook.$id} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ebook.title}</p>
                    <p className="text-xs text-muted-foreground">by {ebook.author}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={ebook.status === "active" ? "default" : "secondary"} className="text-xs">
                      {ebook.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(ebook.$createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Recent Downloads
          </CardTitle>
          <CardDescription>Books you've downloaded recently</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDownloads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No downloads yet</p>
          ) : (
            <div className="space-y-4">
              {recentDownloads.map((download) => {
                const ebook = ebooks.find((e) => e.$id === download.ebookId)
                return (
                  <div key={download.$id} className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ebook?.title || "Unknown Book"}</p>
                      <p className="text-xs text-muted-foreground">by {ebook?.author || "Unknown Author"}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(download.downloadedAt)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
