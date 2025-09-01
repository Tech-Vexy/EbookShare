"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/catalog/search-filters"
import { EbookGrid } from "@/components/catalog/ebook-grid"
import { Button } from "@/components/ui/button"
import { ebookService } from "@/lib/ebook-service"
import type { Ebook, Category } from "@/lib/database-schema"

const ITEMS_PER_PAGE = 12

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "downloads" | "title">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEbooks, setTotalEbooks] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Handle URL parameters
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search")
    const sortParam = searchParams.get("sort") as "newest" | "oldest" | "downloads" | "title"

    if (categoryParam) setCategoryFilter(categoryParam)
    if (searchParam) setSearch(searchParam)
    if (sortParam) setSortBy(sortParam)
  }, [searchParams])

  useEffect(() => {
    loadEbooks(true)
  }, [search, categoryFilter, sortBy])

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
        search: search || undefined,
        categoryId: categoryFilter,
        sortBy,
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
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
    loadEbooks(false)
  }

  const handleSearch = (query: string) => {
    setSearch(query)
  }

  const handleCategoryFilter = (categoryId: string | undefined) => {
    setCategoryFilter(categoryId)
  }

  const handleSortChange = (newSortBy: "newest" | "oldest" | "downloads" | "title") => {
    setSortBy(newSortBy)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-sans font-bold mb-2">Ebook Catalog</h1>
            <p className="text-muted-foreground">Discover and download technical ebooks from our community library</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <SearchFilters
              categories={categories}
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
              onSortChange={handleSortChange}
              currentSearch={search}
              currentCategory={categoryFilter}
              currentSort={sortBy}
            />
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {ebooks.length} of {totalEbooks} ebooks
                {categoryFilter && categories.length > 0 && (
                  <span>
                    {" "}
                    in <span className="font-medium">{categories.find((cat) => cat.$id === categoryFilter)?.name}</span>
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Ebook Grid */}
          <EbookGrid ebooks={ebooks} categories={categories} loading={loading} />

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="text-center mt-8">
              <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline" size="lg">
                {loadingMore ? "Loading..." : "Load More Books"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
