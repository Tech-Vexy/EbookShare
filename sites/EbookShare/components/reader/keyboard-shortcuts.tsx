"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToastNotifications } from "@/hooks/use-toast-notifications"

interface ReadingKeyboardShortcutsProps {
  onToggleSidebar?: () => void
  onToggleFullscreen?: () => void
  onAddNote?: () => void
  onAddBookmark?: () => void
  onNextPage?: () => void
  onPrevPage?: () => void
  isEnabled?: boolean
}

export function ReadingKeyboardShortcuts({
  onToggleSidebar,
  onToggleFullscreen,
  onAddNote,
  onAddBookmark,
  onNextPage,
  onPrevPage,
  isEnabled = true,
}: ReadingKeyboardShortcutsProps) {
  const router = useRouter()
  const { showInfo } = useToastNotifications()

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return

    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return
    }

    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey

    // Handle shortcuts
    switch (true) {
      // Navigation
      case key === 'escape':
        event.preventDefault()
        router.back()
        break

      case key === 'arrowright' || key === 'j':
        event.preventDefault()
        onNextPage?.()
        break

      case key === 'arrowleft' || key === 'k':
        event.preventDefault()
        onPrevPage?.()
        break

      // Interface toggles
      case key === 's' && !ctrl:
        event.preventDefault()
        onToggleSidebar?.()
        break

      case key === 'f' && !ctrl:
        event.preventDefault()
        onToggleFullscreen?.()
        break

      // Actions
      case key === 'n' && !ctrl:
        event.preventDefault()
        onAddNote?.()
        break

      case key === 'b' && !ctrl:
        event.preventDefault()
        onAddBookmark?.()
        break

      // Help
      case key === '?' || (key === '/' && shift):
        event.preventDefault()
        showShortcutsHelp()
        break

      // Download (Ctrl/Cmd + D)
      case key === 'd' && ctrl:
        event.preventDefault()
        // This will be handled by the browser's default download behavior
        break

      default:
        break
    }
  }, [isEnabled, router, onToggleSidebar, onToggleFullscreen, onAddNote, onAddBookmark, onNextPage, onPrevPage])

  const showShortcutsHelp = useCallback(() => {
    showInfo("Keyboard shortcuts available!", {
      description: "Press Esc to go back, S to toggle sidebar, F for fullscreen, N for notes, B for bookmarks, ←→ or J/K for navigation"
    })
  }, [showInfo])

  useEffect(() => {
    if (!isEnabled) return

    document.addEventListener('keydown', handleKeyPress)
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress, isEnabled])

  return null // This component doesn't render anything
}

// Hook for easier usage
export function useReadingKeyboardShortcuts(options: ReadingKeyboardShortcutsProps) {
  return <ReadingKeyboardShortcuts {...options} />
}
