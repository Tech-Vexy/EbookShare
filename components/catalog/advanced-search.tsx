"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  Download,
  FileText,
  Tag,
  User,
  SlidersHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/database-schema"

interface SearchFilters {
  query: string
  categories: string[]
  languages: string[]
  authors: string[]
  tags: string[]
  sortBy: "newest" | "oldest" | "downloads" | "title" | "relevance"
  minFileSize: number
  maxFileSize: number
  yearRange: [number, number]
}

interface AdvancedSearchProps {
  categories: Category[]
  onSearch: (filters: SearchFilters) => void
  className?: string
}

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categories: [],
  languages: [],
  authors: [],
  tags: [],
  sortBy: "relevance",
  minFileSize: 0,
  maxFileSize: 500, // MB
  yearRange: [2000, new Date().getFullYear()],
}

// Mock data - in real app, this would come from your API
const MOCK_AUTHORS = [
  "Robert C. Martin", "Martin Fowler", "Kent Beck", "Eric Evans",
  "Gang of Four", "Brian Kernighan", "Donald Knuth", "Bjarne Stroustrup"
]

const MOCK_LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Russian", "Chinese", "Japanese"
]

const MOCK_TAGS = [
  "algorithms", "data-structures", "web-development", "machine-learning",
  "database", "networking", "security", "mobile", "devops", "testing"
]

export function AdvancedSearch({ categories, onSearch, className }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {
      query: searchParams.get("q") || "",
      categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
      sortBy: (searchParams.get("sort") as SearchFilters["sortBy"]) || "relevance",
    }
    setFilters(prev => ({ ...prev, ...urlFilters }))
  }, [searchParams])

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const addToArrayFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      if (!currentArray.includes(value)) {
        return { ...prev, [key]: [...currentArray, value] }
      }
      return prev
    })
  }, [])

  const removeFromArrayFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).filter(item => item !== value)
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    onSearch(DEFAULT_FILTERS)
  }, [onSearch])

  const applyFilters = useCallback(() => {
    onSearch(filters)
    
    // Update URL params
    const params = new URLSearchParams()
    if (filters.query) params.set("q", filters.query)
    if (filters.categories.length) params.set("categories", filters.categories.join(","))
    if (filters.sortBy !== "relevance") params.set("sort", filters.sortBy)
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [filters, onSearch, router])

  const hasActiveFilters = filters.query || 
    filters.categories.length > 0 || 
    filters.languages.length > 0 || 
    filters.authors.length > 0 || 
    filters.tags.length > 0 ||
    filters.sortBy !== "relevance"

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for ebooks, authors, topics..."
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && applyFilters()}
          className="pl-10 pr-24 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-200"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "h-8 px-3 transition-all duration-200",
                  hasActiveFilters && "bg-primary/10 text-primary border border-primary/20"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {filters.categories.length + filters.languages.length + filters.authors.length + filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 glass" align="end">
              <AdvancedFilters
                filters={filters}
                categories={categories}
                updateFilter={updateFilter}
                addToArrayFilter={addToArrayFilter}
                removeFromArrayFilter={removeFromArrayFilter}
                clearFilters={clearFilters}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={applyFilters} size="sm" className="h-8">
            Search
          </Button>
        </div>
      </div>

      {/* Quick filters bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Active filter badges */}
        {filters.categories.map(categoryId => {
          const category = categories.find(c => c.$id === categoryId)
          return category ? (
            <Badge key={categoryId} variant="secondary" className="gap-1">
              {category.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFromArrayFilter("categories", categoryId)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ) : null
        })}

        {filters.languages.map(language => (
          <Badge key={language} variant="outline" className="gap-1">
            {language}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeFromArrayFilter("languages", language)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}

interface AdvancedFiltersProps {
  filters: SearchFilters
  categories: Category[]
  updateFilter: (key: keyof SearchFilters, value: any) => void
  addToArrayFilter: (key: keyof SearchFilters, value: string) => void
  removeFromArrayFilter: (key: keyof SearchFilters, value: string) => void
  clearFilters: () => void
}

function AdvancedFilters({
  filters,
  categories,
  updateFilter,
  addToArrayFilter,
  removeFromArrayFilter,
  clearFilters,
}: AdvancedFiltersProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Categories
        </Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {categories.map(category => (
            <div key={category.$id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.$id}`}
                checked={filters.categories.includes(category.$id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addToArrayFilter("categories", category.$id)
                  } else {
                    removeFromArrayFilter("categories", category.$id)
                  }
                }}
              />
              <Label 
                htmlFor={`category-${category.$id}`}
                className="text-sm cursor-pointer truncate"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Languages
        </Label>
        <Command className="border rounded-md">
          <CommandInput placeholder="Search languages..." className="h-8" />
          <CommandList className="max-h-32">
            <CommandEmpty>No languages found.</CommandEmpty>
            <CommandGroup>
              {MOCK_LANGUAGES.map(language => (
                <CommandItem
                  key={language}
                  onSelect={() => {
                    if (filters.languages.includes(language)) {
                      removeFromArrayFilter("languages", language)
                    } else {
                      addToArrayFilter("languages", language)
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <Checkbox checked={filters.languages.includes(language)} />
                  <span>{language}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {/* File Size Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Download className="h-4 w-4" />
          File Size (MB)
        </Label>
        <div className="px-2">
          <Slider
            value={[filters.minFileSize, filters.maxFileSize]}
            onValueChange={([min, max]) => {
              updateFilter("minFileSize", min)
              updateFilter("maxFileSize", max)
            }}
            max={500}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{filters.minFileSize} MB</span>
            <span>{filters.maxFileSize} MB</span>
          </div>
        </div>
      </div>

      {/* Publication Year Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Publication Year
        </Label>
        <div className="px-2">
          <Slider
            value={filters.yearRange}
            onValueChange={(value) => updateFilter("yearRange", value as [number, number])}
            max={new Date().getFullYear()}
            min={1990}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{filters.yearRange[0]}</span>
            <span>{filters.yearRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
