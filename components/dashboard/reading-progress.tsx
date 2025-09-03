"use client"

import { useState } from "react"
import { 
  BookOpen, 
  Clock, 
  Star, 
  Bookmark as BookmarkIcon,
  StickyNote,
  BarChart3,
  Target,
  Calendar,
  Trophy,
  Plus,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReadingProgress } from "@/hooks/use-reading-progress"
import { cn } from "@/lib/utils"

interface ReadingProgressCardProps {
  ebookId: string
  ebookTitle: string
  className?: string
}

export function ReadingProgressCard({ ebookId, ebookTitle, className }: ReadingProgressCardProps) {
  const { getProgress, updateProgress, addNote, addPageBookmark } = useReadingProgress()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("")
  const [totalPages, setTotalPages] = useState("")
  const [readingTime, setReadingTime] = useState("")
  const [newNote, setNewNote] = useState("")
  const [bookmarkPage, setBookmarkPage] = useState("")

  const progressData = getProgress(ebookId)

  const handleUpdateProgress = async () => {
    const current = parseInt(currentPage) || 0
    const total = parseInt(totalPages) || progressData?.totalPages || 0
    const time = parseInt(readingTime) || 0

    await updateProgress(ebookId, {
      currentPage: current,
      totalPages: total,
      readingTimeMinutes: (progressData?.readingTimeMinutes || 0) + time,
    })

    setCurrentPage("")
    setTotalPages("")
    setReadingTime("")
    setIsDialogOpen(false)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    const page = bookmarkPage ? parseInt(bookmarkPage) : undefined
    await addNote(ebookId, newNote.trim(), page)
    setNewNote("")
    setBookmarkPage("")
  }

  const handleAddBookmark = async () => {
    const page = parseInt(bookmarkPage)
    if (!page) return
    
    await addPageBookmark(ebookId, page)
    setBookmarkPage("")
  }

  return (
    <Card className={cn("glass", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium truncate">{ebookTitle}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Reading Progress</DialogTitle>
                <DialogDescription>
                  Track your progress for "{ebookTitle}"
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="progress" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="progress" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-page">Current Page</Label>
                      <Input
                        id="current-page"
                        type="number"
                        placeholder={progressData?.currentPage?.toString() || "0"}
                        value={currentPage}
                        onChange={(e) => setCurrentPage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-pages">Total Pages</Label>
                      <Input
                        id="total-pages"
                        type="number"
                        placeholder={progressData?.totalPages?.toString() || "0"}
                        value={totalPages}
                        onChange={(e) => setTotalPages(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reading-time">Reading Time (minutes)</Label>
                    <Input
                      id="reading-time"
                      type="number"
                      placeholder="30"
                      value={readingTime}
                      onChange={(e) => setReadingTime(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleUpdateProgress} className="w-full">
                    Update Progress
                  </Button>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note">Add Note</Label>
                    <Textarea
                      id="note"
                      placeholder="Your thoughts about this section..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-page">Page (optional)</Label>
                    <Input
                      id="note-page"
                      type="number"
                      placeholder="Page number"
                      value={bookmarkPage}
                      onChange={(e) => setBookmarkPage(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddNote} className="w-full">
                    Add Note
                  </Button>
                </TabsContent>
                
                <TabsContent value="bookmarks" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookmark-page">Page Number</Label>
                    <Input
                      id="bookmark-page"
                      type="number"
                      placeholder="Page to bookmark"
                      value={bookmarkPage}
                      onChange={(e) => setBookmarkPage(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddBookmark} className="w-full">
                    Add Page Bookmark
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {progressData ? (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressData.progressPercentage}%</span>
              </div>
              <Progress value={progressData.progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Page {progressData.currentPage}</span>
                <span>of {progressData.totalPages}</span>
              </div>
            </div>

            {/* Reading Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{Math.round(progressData.readingTimeMinutes / 60 * 10) / 10}h</span>
              </div>
              {progressData.isCompleted && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span>Completed</span>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-1">
              {progressData.isCompleted && (
                <Badge variant="default" className="text-xs">
                  Finished
                </Badge>
              )}
              {progressData.bookmarks && progressData.bookmarks.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {progressData.bookmarks.length} bookmarks
                </Badge>
              )}
              {progressData.notes && progressData.notes.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {progressData.notes.length} notes
                </Badge>
              )}
            </div>

            {/* Last Read */}
            <div className="text-xs text-muted-foreground">
              Last read {new Date(progressData.lastReadAt).toLocaleDateString()}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Start reading to track your progress
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Reading Stats Dashboard
export function ReadingStatsDashboard({ className }: { className?: string }) {
  const { getReadingStats, progress } = useReadingProgress()
  const stats = getReadingStats()

  const recentlyRead = progress
    .filter(p => p.lastReadAt)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, 5)

  const currentlyReading = progress.filter(p => !p.isCompleted && p.progressPercentage > 0)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalBooksRead}</p>
                <p className="text-xs text-muted-foreground">Books Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{Math.round(stats.totalReadingTime / 60)}</p>
                <p className="text-xs text-muted-foreground">Hours Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.booksInProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Reading */}
      {currentlyReading.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Currently Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentlyReading.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Ebook ID: {book.ebookId}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Progress value={book.progressPercentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">
                        {book.progressPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Read */}
      {recentlyRead.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyRead.map((book) => (
                <div key={book.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ebook ID: {book.ebookId}</p>
                    <p className="text-sm text-muted-foreground">
                      {book.isCompleted ? "Completed" : `${book.progressPercentage}% complete`}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {new Date(book.lastReadAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
