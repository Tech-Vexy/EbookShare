import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

// Ebook Card Skeleton
function EbookCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-[240px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Grid of Ebook Cards Skeleton
function EbookGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <EbookCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Category Card Skeleton
function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

// List Item Skeleton
function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

// Table Row Skeleton
function TableRowSkeleton({ columns = 4, className }: { columns?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

// Dashboard Stats Skeleton
function DashboardStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3 p-6 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

// Search Results Skeleton
function SearchResultsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Search header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      
      {/* Filters */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      
      {/* Results */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-24 w-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Form Skeleton
function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Profile Skeleton
function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-start gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Content sections */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Navigation Skeleton
function NavigationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      <div className="flex items-center gap-8">
        <Skeleton className="h-8 w-32" />
        <div className="hidden md:flex gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  )
}

// Page Skeleton - Full page loading
function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("min-h-screen space-y-6", className)}>
      <NavigationSkeleton />
      <div className="container mx-auto px-4 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <EbookGridSkeleton />
      </div>
    </div>
  )
}

export {
  Skeleton,
  EbookCardSkeleton,
  EbookGridSkeleton,
  CategoryCardSkeleton,
  ListItemSkeleton,
  TableRowSkeleton,
  DashboardStatsSkeleton,
  SearchResultsSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  NavigationSkeleton,
  PageSkeleton,
}
