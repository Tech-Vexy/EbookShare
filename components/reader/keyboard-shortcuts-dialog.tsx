"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Keyboard, 
  Navigation, 
  Settings, 
  BookOpen,
  Download,
  ArrowLeft,
  ArrowRight
} from "lucide-react"

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

const shortcuts: ShortcutItem[] = [
  // Navigation
  { keys: ["Esc"], description: "Go back to previous page", category: "Navigation" },
  { keys: ["→", "J"], description: "Next page", category: "Navigation" },
  { keys: ["←", "K"], description: "Previous page", category: "Navigation" },
  
  // Interface
  { keys: ["S"], description: "Toggle sidebar/reading panel", category: "Interface" },
  { keys: ["F"], description: "Toggle fullscreen mode", category: "Interface" },
  
  // Actions
  { keys: ["N"], description: "Add a new note", category: "Actions" },
  { keys: ["B"], description: "Add/remove bookmark", category: "Actions" },
  { keys: ["Ctrl", "D"], description: "Download file", category: "Actions" },
  
  // Help
  { keys: ["?", "Shift+/"], description: "Show keyboard shortcuts", category: "Help" },
]

const categoryIcons = {
  Navigation: Navigation,
  Interface: Settings,
  Actions: BookOpen,
  Help: Keyboard,
}

export function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true)
    
    window.addEventListener('readingInterface:showHelp', handleShowHelp)
    
    return () => {
      window.removeEventListener('readingInterface:showHelp', handleShowHelp)
    }
  }, [])

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, ShortcutItem[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the reading interface more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">
                      {category}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm text-muted-foreground flex-1">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <div key={keyIndex} className="flex items-center gap-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {key === "→" ? (
                                  <><ArrowRight className="h-3 w-3" /></>
                                ) : key === "←" ? (
                                  <><ArrowLeft className="h-3 w-3" /></>
                                ) : key === "Ctrl" ? (
                                  "Ctrl"
                                ) : key === "Shift+/" ? (
                                  "Shift + /"
                                ) : (
                                  key
                                )}
                              </Badge>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-xs text-muted-foreground">or</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {category !== "Help" && <Separator className="mt-4" />}
                </div>
              )
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Keyboard shortcuts are disabled when typing in text fields or inputs.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
