"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToastNotifications } from "@/hooks/use-toast-notifications"

interface ReadingProgress {
  id: string
  userId: string
  ebookId: string
  currentPage: number
  totalPages: number
  progressPercentage: number
  lastReadAt: string
  readingTimeMinutes: number
  notes?: string[]
  bookmarks?: number[] // page numbers
  isCompleted: boolean
  completedAt?: string
  rating?: number
}

interface UseReadingProgressReturn {
  progress: ReadingProgress[]
  getProgress: (ebookId: string) => ReadingProgress | null
  updateProgress: (ebookId: string, updates: Partial<ReadingProgress>) => Promise<void>
  markAsRead: (ebookId: string, totalPages: number) => Promise<void>
  addNote: (ebookId: string, note: string, page?: number) => Promise<void>
  addPageBookmark: (ebookId: string, page: number) => Promise<void>
  removePageBookmark: (ebookId: string, page: number) => Promise<void>
  getReadingStats: () => {
    totalBooksRead: number
    totalReadingTime: number
    averageRating: number
    booksInProgress: number
  }
  loading: boolean
}

export function useReadingProgress(): UseReadingProgressReturn {
  const { user } = useAuth()
  const { showSuccess, showError } = useToastNotifications()
  const [progress, setProgress] = useState<ReadingProgress[]>([])
  const [loading, setLoading] = useState(false)

  // Load progress from localStorage
  const loadProgress = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const stored = localStorage.getItem(`reading_progress_${user.$id}`)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Error loading reading progress:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: ReadingProgress[]) => {
    if (!user) return
    localStorage.setItem(`reading_progress_${user.$id}`, JSON.stringify(newProgress))
  }, [user])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const getProgress = useCallback((ebookId: string) => {
    return progress.find(p => p.ebookId === ebookId) || null
  }, [progress])

  const updateProgress = useCallback(async (ebookId: string, updates: Partial<ReadingProgress>) => {
    if (!user) return

    const existingProgress = getProgress(ebookId)
    
    let updatedProgress: ReadingProgress
    
    if (existingProgress) {
      updatedProgress = { ...existingProgress, ...updates, lastReadAt: new Date().toISOString() }
    } else {
      updatedProgress = {
        id: crypto.randomUUID(),
        userId: user.$id,
        ebookId,
        currentPage: 0,
        totalPages: 0,
        progressPercentage: 0,
        lastReadAt: new Date().toISOString(),
        readingTimeMinutes: 0,
        isCompleted: false,
        ...updates,
      }
    }

    // Calculate progress percentage
    if (updatedProgress.totalPages > 0) {
      updatedProgress.progressPercentage = Math.round((updatedProgress.currentPage / updatedProgress.totalPages) * 100)
    }

    // Mark as completed if we've reached the end
    if (updatedProgress.progressPercentage >= 100 && !updatedProgress.isCompleted) {
      updatedProgress.isCompleted = true
      updatedProgress.completedAt = new Date().toISOString()
      showSuccess("Congratulations! You've finished reading this ebook!")
    }

    const newProgress = existingProgress
      ? progress.map(p => p.ebookId === ebookId ? updatedProgress : p)
      : [...progress, updatedProgress]

    setProgress(newProgress)
    saveProgress(newProgress)
  }, [user, progress, getProgress, saveProgress, showSuccess])

  const markAsRead = useCallback(async (ebookId: string, totalPages: number) => {
    await updateProgress(ebookId, {
      currentPage: totalPages,
      totalPages,
      progressPercentage: 100,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    })
  }, [updateProgress])

  const addNote = useCallback(async (ebookId: string, note: string, page?: number) => {
    const existingProgress = getProgress(ebookId)
    const noteWithPage = page ? `Page ${page}: ${note}` : note
    
    const newNotes = existingProgress?.notes 
      ? [...existingProgress.notes, noteWithPage]
      : [noteWithPage]

    await updateProgress(ebookId, { notes: newNotes })
    showSuccess("Note added to your reading progress")
  }, [getProgress, updateProgress, showSuccess])

  const addPageBookmark = useCallback(async (ebookId: string, page: number) => {
    const existingProgress = getProgress(ebookId)
    const bookmarks = existingProgress?.bookmarks || []
    
    if (!bookmarks.includes(page)) {
      await updateProgress(ebookId, { bookmarks: [...bookmarks, page].sort((a, b) => a - b) })
      showSuccess(`Page ${page} bookmarked`)
    }
  }, [getProgress, updateProgress, showSuccess])

  const removePageBookmark = useCallback(async (ebookId: string, page: number) => {
    const existingProgress = getProgress(ebookId)
    const bookmarks = existingProgress?.bookmarks || []
    
    await updateProgress(ebookId, { bookmarks: bookmarks.filter(p => p !== page) })
    showSuccess(`Page ${page} bookmark removed`)
  }, [getProgress, updateProgress, showSuccess])

  const getReadingStats = useCallback(() => {
    const totalBooksRead = progress.filter(p => p.isCompleted).length
    const totalReadingTime = progress.reduce((total, p) => total + p.readingTimeMinutes, 0)
    const ratingsSum = progress.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0)
    const ratedBooks = progress.filter(p => p.rating).length
    const averageRating = ratedBooks > 0 ? ratingsSum / ratedBooks : 0
    const booksInProgress = progress.filter(p => !p.isCompleted && p.progressPercentage > 0).length

    return {
      totalBooksRead,
      totalReadingTime,
      averageRating,
      booksInProgress,
    }
  }, [progress])

  return {
    progress,
    getProgress,
    updateProgress,
    markAsRead,
    addNote,
    addPageBookmark,
    removePageBookmark,
    getReadingStats,
    loading,
  }
}
