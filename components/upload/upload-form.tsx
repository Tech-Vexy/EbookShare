"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { ebookService } from "@/lib/ebook-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, X, FileText, Plus } from "lucide-react"
import { CreateCategoryForm } from "@/components/categories/create-category-form"
import type { Category } from "@/lib/database-schema"

export function UploadForm() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isbn, setIsbn] = useState("")
  const [publishedYear, setPublishedYear] = useState("")
  const [language, setLanguage] = useState("en")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await ebookService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory])
    setCategoryId(newCategory.$id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        setFile(null)
        return
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError("File size must be less than 50MB")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError("")
      
      // Auto-populate title if empty
      if (!title && selectedFile.name) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "")
        setTitle(nameWithoutExt)
      }
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (selectedImage) {
      if (!selectedImage.type.startsWith("image/")) {
        setError("Please select a valid image file for the cover.")
        setCoverImage(null)
        setCoverPreview("")
        return
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        setError("Cover image size must be less than 5MB.")
        setCoverImage(null)
        setCoverPreview("")
        return
      }
      setCoverImage(selectedImage)
      setError("")
      setCoverPreview(URL.createObjectURL(selectedImage))
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  if (!user || !file) return

    setError("")
    setLoading(true)

    try {
      // Upload file to storage
      const fileId = await ebookService.uploadFile(file)
      let coverImageId: string | undefined = undefined
      if (coverImage) {
        coverImageId = await ebookService.uploadCoverImage(coverImage)
      }

      // Create ebook record
      await ebookService.createEbook({
  title,
  author,
  description,
  fileId,
  fileName: file.name,
  fileSize: file.size,
  categoryId,
  uploaderId: user.$id,
  tags,
  isbn: isbn || undefined,
  publishedYear: publishedYear ? Number.parseInt(publishedYear) : undefined,
  language,
  coverImageId,
      })

      setSuccess(true)
  // Reset form
  setFile(null)
  setCoverImage(null)
  setCoverPreview("")
  setTitle("")
  setAuthor("")
  setDescription("")
  setCategoryId("")
  setTags([])
  setIsbn("")
  setPublishedYear("")
  setLanguage("en")
    } catch (error: any) {
      setError(error.message || "Failed to upload ebook. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your ebook has been uploaded and is pending review. It will be available in the catalog once approved.
            </p>
            <Button onClick={() => setSuccess(false)}>Upload Another Book</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-sans">Upload Ebook</CardTitle>
        <CardDescription>Share your knowledge with the community by uploading a technical ebook</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">PDF File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
              {file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-8 w-8 text-accent" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setFile(null)
                    }} 
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="file" className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF files only, max 50MB</p>
                </label>
              )}
              <input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="sr-only"
                disabled={loading}
                title="Select PDF file to upload"
                aria-label="Select PDF file to upload"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image (optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
              {coverImage ? (
                <div className="flex items-center justify-center space-x-2">
                  <img src={coverPreview} alt="Cover Preview" className="h-20 w-16 object-cover rounded shadow" />
                  <div>
                    <p className="font-medium">{coverImage.name}</p>
                    <p className="text-sm text-muted-foreground">{(coverImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCoverImage(null)
                      setCoverPreview("")
                    }} 
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="coverImage" className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">Image files only, max 5MB</p>
                </label>
              )}
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="sr-only"
                disabled={loading}
                title="Select cover image to upload"
                aria-label="Select cover image to upload"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the book content, topics covered, and target audience"
              rows={4}
              required
              disabled={loading}
            />
          </div>

          {/* Category and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category *</Label>
                <CreateCategoryForm 
                  onCategoryCreated={handleCategoryCreated}
                  trigger="button"
                  className="h-8 px-2 text-xs"
                />
              </div>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.$id} value={category.$id}>
                      {category.name}
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No categories found. Create one to get started!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN (Optional)</Label>
              <Input
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0-123456-78-9"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year (Optional)</Label>
              <Input
                id="publishedYear"
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter to add)"
              disabled={loading}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !file || !title || !author || !description || !categoryId}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Ebook"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                // Reset the entire form
                setFile(null)
                setCoverImage(null)
                setCoverPreview("")
                setTitle("")
                setAuthor("")
                setDescription("")
                setCategoryId("")
                setTags([])
                setTagInput("")
                setIsbn("")
                setPublishedYear("")
                setLanguage("en")
                setError("")
              }}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
