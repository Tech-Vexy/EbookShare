"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { UploadForm } from "@/components/upload/upload-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-sans font-bold mb-2">Share Your Knowledge</h1>
            <p className="text-muted-foreground">
              Upload technical ebooks to help fellow developers and students learn and grow
            </p>
          </div>
          <UploadForm />
        </div>
      </main>
    </div>
  )
}
