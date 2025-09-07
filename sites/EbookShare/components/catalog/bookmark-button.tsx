"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bookmark, 
  BookmarkCheck, 
  Heart, 
  Star,
  Eye,
  Plus,
  X,
  Edit3
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { cn } from "@/lib/utils"
import type { Ebook } from "@/lib/database-schema"

interface BookmarkButtonProps {
  ebook: Ebook
  variant?: "default" | "minimal" | "detailed"
  className?: string
}

export function BookmarkButton({ ebook, variant = "default", className }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  const bookmarked = isBookmarked(ebook.$id)

  const handleToggleBookmark = async () => {
    if (bookmarked) {
      setLoading(true)
      await removeBookmark(ebook.$id)
      setLoading(false)
    } else {
      setIsDialogOpen(true)
    }
  }

  const handleSaveBookmark = async () => {
    setLoading(true)
    const tagArray = tags.split(",").map(tag => tag.trim()).filter(Boolean)
    await addBookmark(ebook, notes || undefined, tagArray.length > 0 ? tagArray : undefined)
    setIsDialogOpen(false)
    setNotes("")
    setTags("")
    setLoading(false)
  }

  if (variant === "minimal") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleBookmark}
        disabled={loading}
        className={cn(
          "h-8 w-8 p-0 transition-colors",
          bookmarked && "text-primary",
          className
        )}
      >
        {bookmarked ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-2", className)}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleToggleBookmark}
              disabled={loading}
              className="w-full"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </>
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Bookmark</DialogTitle>
              <DialogDescription>
                Save "{ebook.title}" to your reading list with optional notes and tags.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add your thoughts about this ebook..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  placeholder="programming, tutorial, reference"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBookmark}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Bookmark"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Default variant
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={bookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleToggleBookmark}
          disabled={loading}
          className={cn("transition-all duration-200", className)}
        >
          {bookmarked ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Bookmarked
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </>
          )}
        </Button>
      </DialogTrigger>
      
      {!bookmarked && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>
              Save "{ebook.title}" to your reading list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add your thoughts about this ebook..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="programming, tutorial, reference"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveBookmark}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Bookmark"}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

// Reading List Component
interface ReadingListProps {
  className?: string
}

export function ReadingList({ className }: ReadingListProps) {
  const { bookmarks, removeBookmark, updateBookmark } = useBookmarks()
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editTags, setEditTags] = useState("")

  const handleEditBookmark = (bookmarkId: string, currentNotes?: string, currentTags?: string[]) => {
    setEditingBookmark(bookmarkId)
    setEditNotes(currentNotes || "")
    setEditTags(currentTags?.join(", ") || "")
  }

  const handleSaveEdit = async (ebookId: string) => {
    const tagArray = editTags.split(",").map(tag => tag.trim()).filter(Boolean)
    await updateBookmark(ebookId, {
      notes: editNotes || undefined,
      tags: tagArray.length > 0 ? tagArray : undefined,
    })
    setEditingBookmark(null)
    setEditNotes("")
    setEditTags("")
  }

  const handleCancelEdit = () => {
    setEditingBookmark(null)
    setEditNotes("")
    setEditTags("")
  }

  if (bookmarks.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
        <p className="text-muted-foreground">
          Start building your reading list by bookmarking ebooks you find interesting.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Reading List</h3>
        <Badge variant="secondary">{bookmarks.length} books</Badge>
      </div>
      
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium">Ebook ID: {bookmark.ebookId}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBookmark(
                      bookmark.id, 
                      bookmark.notes, 
                      bookmark.tags
                    )}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.ebookId)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingBookmark === bookmark.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="min-h-[60px]"
                  />
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(bookmark.ebookId)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {bookmark.notes && (
                    <p className="text-sm text-muted-foreground">{bookmark.notes}</p>
                  )}
                  
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
