import { Header } from "@/components/layout/header"
import { FeaturedBooks } from "@/components/home/featured-books"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { SetupBanner } from "@/components/setup-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Download, Upload, Users, Search, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-4">
        <SetupBanner />
      </div>

      {/* Hero Section with Enhanced Design */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-slide-in-up">
            <h1 className="text-5xl md:text-7xl font-sans font-bold text-balance mb-8 leading-tight">
              Share Knowledge,
              <br />
              <span className="gradient-text">Advance Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-12 leading-relaxed">
              A modern platform for computer science and software engineering students and professionals to share and
              discover essential ebooks with our vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg hover-lift" asChild>
                <Link href="/catalog">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Books
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 px-8 py-4 text-lg hover-lift" asChild>
                <Link href="/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <FeaturedBooks />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 gradient-text">
              Everything You Need for Academic Success
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Built by developers, for developers. Our platform makes it easy to discover, share, and access technical
              knowledge in a beautiful, modern environment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl w-fit">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Curated Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Access thousands of computer science and software engineering ebooks, carefully organized by topic and
                  difficulty level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl w-fit">
                  <Search className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Find exactly what you need with our advanced search and filtering system. Search by title, author,
                  category, or tags.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl w-fit">
                  <Upload className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Upload and share your favorite technical books with the community. Help others learn and grow together.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl w-fit">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Instant Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Download books instantly with our secure and fast delivery system. No waiting, no hassle.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl w-fit">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Your data is protected with enterprise-grade security. Download tracking and user management built-in.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl w-fit">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Join a vibrant community of learners, developers, and educators passionate about sharing knowledge.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 gradient-text">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and professionals who are already using our platform to enhance their skills
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift px-8 py-4 text-lg" asChild>
              <Link href="/auth">
                <Users className="mr-2 h-5 w-5" />
                Join Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 px-8 py-4 text-lg hover-lift" asChild>
              <Link href="/catalog">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Books
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t bg-gradient-to-br from-muted/30 to-background py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-sans font-bold gradient-text">EbookShare</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A modern platform for sharing and discovering technical ebooks in computer science and software
                engineering. Built by the community, for the community.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-primary">Browse</h3>
              <div className="space-y-3">
                <Link href="/catalog" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  All Books
                </Link>
                <Link href="/categories" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  Categories
                </Link>
                <Link href="/catalog?sort=newest" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  New Releases
                </Link>
                <Link href="/catalog?sort=downloads" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  Popular Books
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-primary">Community</h3>
              <div className="space-y-3">
                <Link href="/auth" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  Join Us
                </Link>
                <Link href="/upload" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  Upload Books
                </Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-primary">Support</h3>
              <div className="space-y-3">
                <span className="block text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">Help Center</span>
                <span className="block text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">Contact Us</span>
                <span className="block text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">Privacy Policy</span>
                <span className="block text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 <span className="gradient-text font-semibold">EbookShare</span>. Built for the developer community with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
