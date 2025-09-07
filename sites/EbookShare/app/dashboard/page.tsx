"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UserProfile } from "@/components/dashboard/user-profile"
import { ReadingStatsDashboard } from "@/components/dashboard/reading-progress"
import { ReadingList } from "@/components/catalog/bookmark-button"
import { DashboardErrorBoundary } from "@/components/ui/error-boundary"
import { DashboardStatsSkeleton } from "@/components/ui/skeletons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ebookService } from "@/lib/ebook-service"
import { downloadService } from "@/lib/download-service"
import { Plus, BookOpen, TrendingUp, Bookmark, Activity } from "lucide-react"
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
            <DashboardStatsSkeleton />
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
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-sans font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">Welcome back, {user.name}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
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

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="reading" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Reading
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <DashboardStats stats={stats} />

                {/* Profile and Activity Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <UserProfile user={user} stats={profileStats} />
                  </div>
                  <div className="lg:col-span-2">
                    <RecentActivity 
                      recentUploads={userEbooks} 
                      recentDownloads={recentDownloads} 
                      ebooks={allEbooks} 
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reading" className="space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Reading Progress & Statistics
                    </CardTitle>
                    <CardDescription>
                      Track your reading progress, see statistics, and manage your reading goals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReadingStatsDashboard />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5" />
                      Your Reading List
                    </CardTitle>
                    <CardDescription>
                      Manage your bookmarked ebooks and reading notes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReadingList />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your recent uploads, downloads, and interactions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentActivity 
                        recentUploads={userEbooks} 
                        recentDownloads={recentDownloads} 
                        ebooks={allEbooks}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </DashboardErrorBoundary>
  )
}
