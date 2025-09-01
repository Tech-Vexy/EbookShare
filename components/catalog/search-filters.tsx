"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import type { Category } from "@/lib/database-schema"

interface SearchFiltersProps {
  categories: Category[]
  onSearch: (query: string) => void
  onCategoryFilter: (categoryId: string | undefined) => void
  onSortChange: (sortBy: "newest" | "oldest" | "downloads" | "title") => void
  currentSearch: string
  currentCategory?: string
  currentSort: string
}

export function SearchFilters({
  categories,
  onSearch,
  onCategoryFilter,
  onSortChange,
  currentSearch,
  currentCategory,
  currentSort,
}: SearchFiltersProps) {
  const [searchInput, setSearchInput] = useState(currentSearch)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  const clearCategory = () => {
    onCategoryFilter(undefined)
  }

  const selectedCategory = categories.find((cat) => cat.$id === currentCategory)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search ebooks by title, author, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
          {/* Category Filter */}
          <Select
            value={currentCategory || "all"}
            onValueChange={(value) => onCategoryFilter(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.$id} value={category.$id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={currentSort} onValueChange={(value: any) => onSortChange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(currentSearch || selectedCategory) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: "{currentSearch}"
              <button type="button" onClick={() => onSearch("")} className="hover:bg-muted-foreground/20 rounded">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {selectedCategory.name}
              <button type="button" onClick={clearCategory} className="hover:bg-muted-foreground/20 rounded">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
