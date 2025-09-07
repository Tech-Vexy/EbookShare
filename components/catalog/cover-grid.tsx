"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ebookService } from "@/lib/ebook-service"
import { cn } from "@/lib/utils"
import type { Ebook, Category } from "@/lib/database-schema"

interface CoverGridProps {
  ebooks: Ebook[]
  categories: Category[]
  loading?: boolean
}

interface BookCoverProps {
  ebook: Ebook
  category?: Category
}

function BookCover({ ebook, category }: BookCoverProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get cover image URL
  const getCoverImageSrc = () => {
    if (imageError) return "/placeholder.jpg"
    if (ebook.coverImageId) {
      return ebookService.getCoverImageUrl(ebook.coverImageId)
    }
    return ebook.coverImage || "/placeholder.jpg"
  }

  return (
    <Link href={`/ebook/${ebook.$id}`}>
      <div 
        className={cn(
          "group relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg transition-all duration-500 cursor-pointer",
          "hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-3 hover:scale-[1.03]",
          "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
          "border border-gray-200/50 dark:border-gray-700/50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Book Cover Image */}
        <Image
          src={getCoverImageSrc()}
          alt={ebook.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={false}
        />

        {/* Advanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Subtle Border Glow Effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-500" />

        {/* Enhanced Hover Content */}
        <div className={cn(
          "absolute inset-0 flex flex-col justify-end p-4 text-white transition-all duration-500",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2 drop-shadow-lg">
            {ebook.title}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-1 mb-3 drop-shadow">
            by {ebook.author}
          </p>
          
          {/* Enhanced Category Badge */}
          {category && (
            <div className="inline-flex mb-2">
              <span 
                className={cn(
                  "px-3 py-1 backdrop-blur-md rounded-full text-xs font-medium border border-white/30 text-white",
                  "bg-white/20"
                )}
              >
                {category.name}
              </span>
            </div>
          )}

          {/* Read Now Button */}
          <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 text-sm font-medium hover:bg-white/30 transition-colors">
              Click to Read
            </div>
          </div>
        </div>

        {/* Enhanced Corner Badge for PDF */}
        {ebook.fileName?.toLowerCase().includes('.pdf') && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-red-400/50 backdrop-blur-sm">
            PDF
          </div>
        )}

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
        
        {/* Floating Sparkle Effect */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 animate-pulse" />
        <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 animate-pulse" />
      </div>
    </Link>
  )
}

function BookCoverSkeleton() {
  return (
    <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse border border-gray-200/50 dark:border-gray-700/50">
      <div className="w-full h-full bg-gradient-to-br from-gray-300/50 to-gray-400/50 dark:from-gray-600/50 dark:to-gray-700/50 rounded-xl" />
    </div>
  )
}

export function CoverGrid({ ebooks, categories, loading }: CoverGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 md:gap-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <BookCoverSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search filters or browse different categories.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 md:gap-8">
      {ebooks.map((ebook) => {
        const category = categories.find((cat) => cat.$id === ebook.categoryId)
        return (
          <BookCover 
            key={ebook.$id} 
            ebook={ebook} 
            category={category}
          />
        )
      })}
    </div>
  )
}
