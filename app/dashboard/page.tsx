"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UserProfile } from "@/components/dashboard/user-profile"
import { Button } from "@/components/ui/button"
import { ebookService } from "@/lib/ebook-service"
import { downloadService } from "@/lib/download-service"
import { Plus, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Ebook, Download } from "@/lib/database-schema"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userEbooks, setUserEbooks] = useState<Ebook[]>([])
  const [recentDownloads, setRecentDownloads] = useState<Download[]>([])
  const [allEbooks, setAllEbooks] = useState<Ebook[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      loadDashboardData()
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setDashboardLoading(true)
      const [userEbooksData, downloadStats, { ebooks: allEbooksData }] = await Promise.all([
        ebookService.getEbooksByUser(user.$id),
        downloadService.getUserDownloadStats(user.$id),
        ebookService.getEbooks({ limit: 100 }), // Get ebooks for download history lookup
      ])

      setUserEbooks(userEbooksData)
      setRecentDownloads(downloadStats.recentDownloads)
      setAllEbooks(allEbooksData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setDashboardLoading(false)
    }
  }

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  const stats = {
    totalUploads: userEbooks.length,
    totalDownloads: recentDownloads.length,
    totalViews: userEbooks.reduce((sum, ebook) => sum + ebook.downloadCount, 0),
    monthlyGrowth: 12, // This would be calculated based on historical data
  }

  const profileStats = {
    totalUploads: userEbooks.length,
    totalDownloads: recentDownloads.length,
    joinDate: user.$createdAt || new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-sans font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Book
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Catalog
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <DashboardStats stats={stats} />

          {/* Profile and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <UserProfile user={user} stats={profileStats} />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity recentUploads={userEbooks} recentDownloads={recentDownloads} ebooks={allEbooks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
