"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Palette, Check, X } from "lucide-react"
import { ebookService } from "@/lib/ebook-service"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import { cn } from "@/lib/utils"

interface CreateCategoryFormProps {
  onCategoryCreated?: (category: any) => void
  trigger?: "button" | "card"
  className?: string
}

const predefinedColors = [
  { name: "Blue", value: "#3b82f6", bgClass: "bg-blue-500" },
  { name: "Green", value: "#10b981", bgClass: "bg-emerald-500" },
  { name: "Purple", value: "#8b5cf6", bgClass: "bg-violet-500" },
  { name: "Orange", value: "#f59e0b", bgClass: "bg-amber-500" },
  { name: "Red", value: "#ef4444", bgClass: "bg-red-500" },
  { name: "Pink", value: "#ec4899", bgClass: "bg-pink-500" },
  { name: "Indigo", value: "#6366f1", bgClass: "bg-indigo-500" },
  { name: "Teal", value: "#14b8a6", bgClass: "bg-teal-500" },
  { name: "Yellow", value: "#eab308", bgClass: "bg-yellow-500" },
  { name: "Cyan", value: "#06b6d4", bgClass: "bg-cyan-500" },
  { name: "Emerald", value: "#059669", bgClass: "bg-emerald-600" },
  { name: "Rose", value: "#f43f5e", bgClass: "bg-rose-500" },
]

export function CreateCategoryForm({ onCategoryCreated, trigger = "button", className }: CreateCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })

  const { showSuccess, showError } = useToastNotifications()
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showError("Category name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const slug = generateSlug(formData.name)
      
      const newCategory = await ebookService.createCategory({
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        color: formData.color,
      })

      showSuccess(`Category "${newCategory.name}" created successfully!`)
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
      })
      
      setIsOpen(false)
      
      // Notify parent component
      onCategoryCreated?.(newCategory)
      
      // Refresh the page to show the new category
      router.refresh()
      
    } catch (error: any) {
      console.error("Error creating category:", error)
      
      if (error.message?.includes("already exists") || error.code === 409) {
        showError("A category with this name already exists")
      } else {
        showError("Failed to create category. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const TriggerComponent = trigger === "card" ? (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-dashed border-2", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-center">
        <CardTitle className="text-lg font-sans leading-tight group-hover:text-accent transition-colors mb-2">
          Add New Category
        </CardTitle>
        <CardDescription className="mb-4">
          Create a new category for organizing books
        </CardDescription>
      </CardContent>
    </Card>
  ) : (
    <Button variant="default" className={className}>
      <Plus className="h-4 w-4 mr-2" />
      Add Category
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerComponent}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new category to help organize books in your library. Categories will be visible to all users.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Science Fiction, Programming, History"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                maxLength={100}
              />
              {formData.name && (
                <div className="text-xs text-muted-foreground">
                  Slug: <code className="bg-muted px-1 rounded">{generateSlug(formData.name)}</code>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.description.length}/500 characters
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Category Color
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative",
                      color.bgClass,
                      formData.color === color.value
                        ? "border-foreground shadow-lg"
                        : "border-border"
                    )}
                    title={color.name}
                  >
                    {formData.color === color.value && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Custom Color Input */}
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Label className="text-sm text-muted-foreground">Or choose a custom color</Label>
              </div>
            </div>
            
            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex-shrink-0",
                      predefinedColors.find(c => c.value === formData.color)?.bgClass || "bg-blue-500"
                    )} />
                    <div>
                      <div className="font-medium">
                        {formData.name || "Category Name"}
                      </div>
                      {formData.description && (
                        <div className="text-sm text-muted-foreground">
                          {formData.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">0 books</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
