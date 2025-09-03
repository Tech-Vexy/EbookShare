"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, FolderOpen, Lock } from "lucide-react"
import { ebookService } from "@/lib/ebook-service"
import { CategoryColorDot } from "@/components/categories/category-color-dot"
import { useAuth } from "@/hooks/use-auth"
import type { Category } from "@/lib/database-schema"
import Link from "next/link"

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Only load categories if user is authenticated
    if (!authLoading && user) {
      loadCategories()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadCategories = async () => {
    try {
      const categoriesData = await ebookService.getCategories()
      // Show top 6 categories by book count
      const topCategories = categoriesData.sort((a, b) => b.ebookCount - a.ebookCount).slice(0, 6)
      setCategories(topCategories)
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-muted to-muted/50 rounded-xl w-1/3 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="mx-auto mb-8 p-6 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-3xl w-fit">
              <FolderOpen className="h-16 w-16 text-accent mx-auto" />
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 gradient-text">
              Explore by Categories
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Browse our organized collection of technical books by subject area and expertise level.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
              <Link href="/auth">
                <Lock className="mr-2 h-5 w-5" />
                Login to Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-muted to-muted/50 rounded-xl w-1/3 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 gradient-text">Popular Categories</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Discover books in the most popular subject areas curated by experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <Card key={category.$id} className="group hover-lift bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryColorDot 
                      color={category.color} 
                      className="shadow-sm ring-2 ring-white/50"
                    />
                    <CardTitle className="text-xl font-sans group-hover:text-primary transition-colors duration-200">
                      {category.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">{category.ebookCount}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-base mb-6 line-clamp-2 leading-relaxed">
                  {category.description || "Explore comprehensive books and resources in this category"}
                </CardDescription>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary border-primary/20 transition-all duration-300 group"
                  variant="outline"
                >
                  <Link href={`/catalog?category=${category.$id}`} className="flex items-center justify-center gap-2">
                    <span>Browse Books</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 px-8 py-4 text-lg hover-lift">
            <Link href="/categories" className="flex items-center gap-2">
              View All Categories
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
