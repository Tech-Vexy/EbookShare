import { EbookCard } from "./ebook-card"
import type { Ebook, Category } from "@/lib/database-schema"

interface EbookGridProps {
  ebooks: Ebook[]
  categories: Category[]
  loading?: boolean
}

export function EbookGrid({ ebooks, categories, loading }: EbookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No ebooks found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or browse different categories.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ebooks.map((ebook) => {
        const category = categories.find((cat) => cat.$id === ebook.categoryId)
        return <EbookCard key={ebook.$id} ebook={ebook} category={category} />
      })}
    </div>
  )
}
