"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Palette 
} from "lucide-react"
import { ebookService } from "@/lib/ebook-service"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import { CategoryColorDot } from "./category-color-dot"
import type { Category } from "@/lib/database-schema"
import { cn } from "@/lib/utils"

interface CategoryManagementProps {
  category: Category
  onCategoryUpdated?: (category: Category) => void
  onCategoryDeleted?: (categoryId: string) => void
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

export function CategoryManagement({ category, onCategoryUpdated, onCategoryDeleted }: CategoryManagementProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
    color: category.color,
  })

  const { showSuccess, showError } = useToastNotifications()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showError("Category name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const slug = generateSlug(formData.name)
      
      const updatedCategory = await ebookService.updateCategory(category.$id, {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        color: formData.color,
      })

      showSuccess(`Category "${updatedCategory.name}" updated successfully!`)
      setEditDialogOpen(false)
      onCategoryUpdated?.(updatedCategory)
      
    } catch (error: any) {
      console.error("Error updating category:", error)
      
      if (error.message?.includes("already exists") || error.code === 409) {
        showError("A category with this name already exists")
      } else {
        showError("Failed to update category. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (category.ebookCount > 0) {
      showError("Cannot delete category that contains books. Please move or delete books first.")
      return
    }

    setIsDeleting(true)

    try {
      await ebookService.deleteCategory(category.$id)
      showSuccess(`Category "${category.name}" deleted successfully!`)
      setDeleteDialogOpen(false)
      onCategoryDeleted?.(category.$id)
      
    } catch (error: any) {
      console.error("Error deleting category:", error)
      showError("Failed to delete category. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Category
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
            disabled={category.ebookCount > 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Category
            </DialogTitle>
            <DialogDescription>
              Update the category information. Changes will be visible to all users.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="space-y-4">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
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
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
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
                      <CategoryColorDot color={formData.color} />
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
                    <Badge variant="secondary">{category.ebookCount} books</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{category.name}"? 
              {category.ebookCount > 0 ? (
                <span className="text-destructive font-medium">
                  <br />This category contains {category.ebookCount} book(s) and cannot be deleted.
                </span>
              ) : (
                " This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || category.ebookCount > 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
