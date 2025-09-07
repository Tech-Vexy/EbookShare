"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { AdvancedSearch } from "@/components/catalog/advanced-search"
import { CoverGrid } from "@/components/catalog/cover-grid"
import { Button } from "@/components/ui/button"
import { CatalogErrorBoundary } from "@/components/ui/error-boundary"
import { ebookService } from "@/lib/ebook-service"
import type { Ebook, Category } from "@/lib/database-schema"

const ITEMS_PER_PAGE = 12

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

function CatalogContent() {
  const searchParams = useSearchParams()
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEbooks, setTotalEbooks] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    languages: [],
    authors: [],
    tags: [],
    sortBy: "relevance",
    minFileSize: 0,
    maxFileSize: 500,
    yearRange: [2000, new Date().getFullYear()],
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Handle URL parameters
    const query = searchParams.get("q") || ""
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || []
    const sortBy = (searchParams.get("sort") as SearchFilters["sortBy"]) || "relevance"

    setActiveFilters(prev => ({
      ...prev,
      query,
      categories,
      sortBy,
    }))
  }, [searchParams])

  useEffect(() => {
    loadEbooks(true)
  }, [activeFilters])

  const loadCategories = async () => {
    try {
      const categoriesData = await ebookService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const loadEbooks = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setCurrentPage(1)
      } else {
        setLoadingMore(true)
      }

      const offset = reset ? 0 : (currentPage - 1) * ITEMS_PER_PAGE

      const { ebooks: newEbooks, total } = await ebookService.getEbooks({
        search: activeFilters.query || undefined,
        categoryId: activeFilters.categories[0], // Use first category for now
        sortBy: activeFilters.sortBy === "relevance" ? "newest" : activeFilters.sortBy,
        limit: ITEMS_PER_PAGE,
        offset,
      })

      if (reset) {
        setEbooks(newEbooks)
      } else {
        setEbooks((prev) => [...prev, ...newEbooks])
      }

      setTotalEbooks(total)
      setHasMore(offset + newEbooks.length < total)
    } catch (error) {
      console.error("Failed to load ebooks:", error)
      throw error // Re-throw to be caught by error boundary
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
    loadEbooks(false)
  }

  const handleSearch = (filters: SearchFilters) => {
    setActiveFilters(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-sans font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Ebook Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and download technical ebooks from our community library. Use advanced filters to find exactly what you're looking for.
            </p>
          </div>

          {/* Advanced Search */}
          <div className="mb-8">
            <AdvancedSearch
              categories={categories}
              onSearch={handleSearch}
              className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border/50"
            />
          </div>

          {/* Results Count and Stats */}
          {!loading && (
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{ebooks.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalEbooks}</span> ebooks
                  {activeFilters.categories.length > 0 && (
                    <span>
                      {" "}in{" "}
                      <span className="font-medium text-primary">
                        {activeFilters.categories
                          .map(catId => categories.find(cat => cat.$id === catId)?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </span>
                  )}
                </p>
              </div>
              {totalEbooks > 0 && (
                <div className="text-sm text-muted-foreground">
                  Sorted by <span className="font-medium capitalize">{activeFilters.sortBy}</span>
                </div>
              )}
            </div>
          )}

          {/* Ebook Grid */}
          <CoverGrid 
            ebooks={ebooks} 
            categories={categories} 
            loading={loading}
          />

          {/* No Results */}
          {ebooks.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-muted-foreground"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No ebooks found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any ebooks matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                variant="outline" 
                onClick={() => handleSearch({
                  query: "",
                  categories: [],
                  languages: [],
                  authors: [],
                  tags: [],
                  sortBy: "relevance",
                  minFileSize: 0,
                  maxFileSize: 500,
                  yearRange: [2000, new Date().getFullYear()],
                })}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && ebooks.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                onClick={handleLoadMore} 
                disabled={loadingMore} 
                variant="outline" 
                size="lg"
                className="min-w-[200px] bg-card/50 backdrop-blur-sm hover:bg-card border-border/50"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Books
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({totalEbooks - ebooks.length} remaining)
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <CatalogErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto py-12 px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 md:gap-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse border border-gray-200/50 dark:border-gray-700/50" />
              ))}
            </div>
          </main>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </CatalogErrorBoundary>
  )
}
