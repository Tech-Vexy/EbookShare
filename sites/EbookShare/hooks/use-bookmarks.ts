"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import type { Ebook } from "@/lib/database-schema"

interface BookmarkData {
  id: string
  userId: string
  ebookId: string
  createdAt: string
  notes?: string
  tags?: string[]
}

interface UseBookmarksReturn {
  bookmarks: BookmarkData[]
  isBookmarked: (ebookId: string) => boolean
  addBookmark: (ebook: Ebook, notes?: string, tags?: string[]) => Promise<void>
  removeBookmark: (ebookId: string) => Promise<void>
  updateBookmark: (ebookId: string, updates: Partial<BookmarkData>) => Promise<void>
  loading: boolean
  error: string | null
}

export function useBookmarks(): UseBookmarksReturn {
  const { user } = useAuth()
  const { showSuccess, showError, showInfo } = useToastNotifications()
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load bookmarks from localStorage (in a real app, this would be from your database)
  const loadBookmarks = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const stored = localStorage.getItem(`bookmarks_${user.$id}`)
      if (stored) {
        setBookmarks(JSON.parse(stored))
      }
    } catch (err) {
      setError("Failed to load bookmarks")
      console.error("Error loading bookmarks:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Save bookmarks to localStorage
  const saveBookmarks = useCallback((newBookmarks: BookmarkData[]) => {
    if (!user) return
    localStorage.setItem(`bookmarks_${user.$id}`, JSON.stringify(newBookmarks))
  }, [user])

  useEffect(() => {
    loadBookmarks()
  }, [loadBookmarks])

  const isBookmarked = useCallback((ebookId: string) => {
    return bookmarks.some(bookmark => bookmark.ebookId === ebookId)
  }, [bookmarks])

  const addBookmark = useCallback(async (ebook: Ebook, notes?: string, tags?: string[]) => {
    if (!user) {
      showError("Please log in to bookmark ebooks")
      return
    }

    if (isBookmarked(ebook.$id)) {
      showInfo("Ebook is already bookmarked")
      return
    }

    const newBookmark: BookmarkData = {
      id: crypto.randomUUID(),
      userId: user.$id,
      ebookId: ebook.$id,
      createdAt: new Date().toISOString(),
      notes,
      tags,
    }

    const newBookmarks = [...bookmarks, newBookmark]
    setBookmarks(newBookmarks)
    saveBookmarks(newBookmarks)
    
    showSuccess(`"${ebook.title}" added to bookmarks`)
  }, [user, bookmarks, isBookmarked, saveBookmarks, showError, showInfo, showSuccess])

  const removeBookmark = useCallback(async (ebookId: string) => {
    if (!user) return

    const newBookmarks = bookmarks.filter(bookmark => bookmark.ebookId !== ebookId)
    setBookmarks(newBookmarks)
    saveBookmarks(newBookmarks)
    
    showSuccess("Bookmark removed")
  }, [user, bookmarks, saveBookmarks, showSuccess])

  const updateBookmark = useCallback(async (ebookId: string, updates: Partial<BookmarkData>) => {
    if (!user) return

    const newBookmarks = bookmarks.map(bookmark =>
      bookmark.ebookId === ebookId
        ? { ...bookmark, ...updates }
        : bookmark
    )
    
    setBookmarks(newBookmarks)
    saveBookmarks(newBookmarks)
    
    showSuccess("Bookmark updated")
  }, [user, bookmarks, saveBookmarks, showSuccess])

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    updateBookmark,
    loading,
    error,
  }
}
