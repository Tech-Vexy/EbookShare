"use client"

import { useState, useEffect } from "react"
import { EbookCard } from "@/components/catalog/ebook-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ebookService } from "@/lib/ebook-service"
import type { Ebook, Category } from "@/lib/database-schema"
import Link from "next/link"

export function FeaturedBooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedBooks()
  }, [])

  const loadFeaturedBooks = async () => {
    try {
      const [featuredEbooks, categoriesData] = await Promise.all([
        ebookService.getFeaturedEbooks(8),
        ebookService.getCategories(),
      ])
      setEbooks(featuredEbooks)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load featured books:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-muted to-muted/50 rounded-xl w-1/3 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (ebooks.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 gradient-text">Featured Books</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Most popular and recently added technical ebooks from our vibrant community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {ebooks.map((ebook, index) => {
            const category = categories.find((cat) => cat.$id === ebook.categoryId)
            return (
              <div 
                key={ebook.$id} 
                className={`animate-slide-in-up`}
              >
                <EbookCard ebook={ebook} category={category} />
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift px-8 py-4 text-lg">
            <Link href="/catalog" className="flex items-center gap-2">
              Browse All Books
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
