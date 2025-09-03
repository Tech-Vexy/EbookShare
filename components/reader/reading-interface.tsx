"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PDFViewer, GenericFileViewer } from "./pdf-viewer"
import { ReadingProgressCard } from "@/components/dashboard/reading-progress"
import { BookmarkButton } from "@/components/catalog/bookmark-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ArrowLeft, 
  BookOpen, 
  Settings, 
  Share2, 
  Star,
  MessageSquare,
  StickyNote,
  Bookmark,
  Clock,
  Eye,
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Keyboard,
  Maximize
} from "lucide-react"
import { ReadingKeyboardShortcuts } from "./keyboard-shortcuts"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"
import { useReadingProgress } from "@/hooks/use-reading-progress"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import type { Ebook } from "@/lib/database-schema"
import { cn } from "@/lib/utils"

interface ReadingInterfaceProps {
  ebook: Ebook
  fileUrl: string
  className?: string
}

export function ReadingInterface({ ebook, fileUrl, className }: ReadingInterfaceProps) {
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isReading, setIsReading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)

  const { getProgress, addNote } = useReadingProgress()
  const { isBookmarked } = useBookmarks()
  const { showSuccess } = useToastNotifications()

  const progress = getProgress(ebook.$id)
  const bookmarked = isBookmarked(ebook.$id)

  const isPDF = ebook.fileName?.toLowerCase().endsWith('.pdf')

  useEffect(() => {
    // Mark as opened in reading progress
    if (isReading) {
      setIsReading(true)
    }
  }, [isReading])

  const handlePageChange = useCallback((page: number, total: number) => {
    setCurrentPage(page)
    setTotalPages(total)
  }, [])

  const handleReadingTimeUpdate = useCallback((minutes: number) => {
    setReadingTime(minutes)
  }, [])

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    await addNote(ebook.$id, newNote.trim(), currentPage > 0 ? currentPage : undefined)
    setNewNote("")
    setNoteDialogOpen(false)
    showSuccess("Note added to your reading progress")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ebook.title,
        text: `Check out "${ebook.title}" by ${ebook.author}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showSuccess("Link copied to clipboard")
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = ebook.fileName || `${ebook.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Keyboard Shortcuts */}
      <ReadingKeyboardShortcuts
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onAddNote={() => setNoteDialogOpen(true)}
        onNextPage={() => {
          // This will be handled by the PDF viewer
          const event = new CustomEvent('readingInterface:nextPage')
          window.dispatchEvent(event)
        }}
        onPrevPage={() => {
          // This will be handled by the PDF viewer
          const event = new CustomEvent('readingInterface:prevPage')
          window.dispatchEvent(event)
        }}
        isEnabled={true}
      />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h1 className="font-semibold text-lg truncate max-w-[300px]">
                  {ebook.title}
                </h1>
                <p className="text-sm text-muted-foreground">by {ebook.author}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden"
            >
              {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <BookmarkButton ebook={ebook} variant="minimal" />
              
              <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <StickyNote className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Reading Note</DialogTitle>
                    <DialogDescription>
                      Add a note for page {currentPage} of "{ebook.title}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note">Note</Label>
                      <Textarea
                        id="note"
                        placeholder="Your thoughts about this section..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setNoteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddNote}>
                        Add Note
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      const event = new CustomEvent('readingInterface:showHelp')
                      window.dispatchEvent(event)
                    }}
                  >
                    <Keyboard className="h-4 w-4 mr-2" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSidebar(!showSidebar)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Reading Panel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          showSidebar ? "md:mr-80" : ""
        )}>
          {isPDF ? (
            <PDFViewer
              fileUrl={fileUrl}
              fileName={ebook.fileName || `${ebook.title}.pdf`}
              ebookId={ebook.$id}
              ebookTitle={ebook.title}
              onPageChange={handlePageChange}
              onReadingTimeUpdate={handleReadingTimeUpdate}
              className="h-full w-full"
            />
          ) : (
            <GenericFileViewer
              fileUrl={fileUrl}
              fileName={ebook.fileName || ebook.title}
              ebookTitle={ebook.title}
              className="h-full w-full"
            />
          )}
        </main>

        {/* Sidebar */}
        <aside className={cn(
          "fixed right-0 top-0 h-full w-80 bg-card/95 backdrop-blur-sm border-l transform transition-transform duration-300 z-30 overflow-y-auto",
          showSidebar ? "translate-x-0" : "translate-x-full",
          "md:static md:transform-none md:h-auto",
          !showSidebar && "md:hidden"
        )}>
          <div className="p-6 space-y-6">
            {/* Close button for mobile */}
            <div className="flex items-center justify-between md:hidden">
              <h3 className="font-semibold">Reading Panel</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="progress" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress" className="text-xs">
                  Progress
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs">
                  Info
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-4">
                <ReadingProgressCard
                  ebookId={ebook.$id}
                  ebookTitle={ebook.title}
                />

                {/* Quick Stats */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Reading Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Page</span>
                      <span className="font-medium">{currentPage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Pages</span>
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Session Time</span>
                      <span className="font-medium">{readingTime} min</span>
                    </div>
                    {progress && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.progressPercentage}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Book Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Author</p>
                      <p className="font-medium">{ebook.author}</p>
                    </div>
                    {ebook.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm line-clamp-4">{ebook.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Format</p>
                      <Badge variant="outline">{ebook.fileName?.split('.').pop()?.toUpperCase() || 'PDF'}</Badge>
                    </div>
                    {ebook.tags && ebook.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {ebook.tags.slice(0, 5).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Reading Notes</CardTitle>
                    <CardDescription className="text-xs">
                      Notes and bookmarks for this book
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {progress?.notes && progress.notes.length > 0 ? (
                      <div className="space-y-2">
                        {progress.notes.slice(0, 5).map((note, index) => (
                          <div key={index} className="p-2 bg-muted/50 rounded-md">
                            <p className="text-xs">{note}</p>
                          </div>
                        ))}
                        {progress.notes.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{progress.notes.length - 5} more notes
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No notes yet. Add notes while reading to track your thoughts.
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNoteDialogOpen(true)}
                      className="w-full"
                    >
                      <StickyNote className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </aside>
      </div>
      
      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog />
    </div>
  )
}
