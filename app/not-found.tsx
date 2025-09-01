import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>

          <h1 className="text-4xl font-sans font-bold mb-4">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/catalog">
                <Search className="mr-2 h-4 w-4" />
                Browse Books
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
