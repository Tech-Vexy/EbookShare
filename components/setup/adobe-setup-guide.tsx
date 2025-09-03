"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Info,
  BookOpen,
  Zap,
  Shield,
  Globe
} from "lucide-react"

export function AdobeSetupGuide() {
  const [copied, setCopied] = useState(false)
  
  const envExample = `# Adobe PDF Embed API
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_actual_client_id_here`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Setup Adobe PDF Embed API</h1>
        <p className="text-muted-foreground">
          Enable in-app PDF reading with Adobe's powerful embed API
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Rich Reading Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Full-featured PDF viewer with annotations, bookmarks, and search
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Fast & Reliable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Optimized rendering and streaming for smooth performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Secure & Free</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              1,000 document transactions per day on the free tier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup (5 minutes)</CardTitle>
          <CardDescription>
            Follow these steps to get your free Adobe PDF Embed API Client ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              1
            </Badge>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Visit Adobe Developer Console</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create a free Adobe Developer account and start a new project
              </p>
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Open Adobe Console <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              2
            </Badge>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Create New Project</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add the PDF Embed API to your project and configure allowed domains
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Add <code className="bg-muted px-1 rounded">localhost:3000</code> for development and your production domain for live apps
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              3
            </Badge>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Copy Your Client ID</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Copy the Client ID from your Adobe project dashboard
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              4
            </Badge>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Update Environment Variables</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add the Client ID to your <code className="bg-muted px-1 rounded">.env.local</code> file
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono">.env.local</code>
                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {envExample}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              5
            </Badge>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Restart Development Server</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Restart your Next.js development server to load the new environment variables
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm font-mono">npm run dev</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Free Tier Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-600 mb-1">✓ Included</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 1,000 document views per day</li>
                <li>• Full PDF viewer features</li>
                <li>• No watermarks</li>
                <li>• Annotations and bookmarks</li>
                <li>• Mobile responsive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">💡 Perfect for</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Development and testing</li>
                <li>• Small to medium applications</li>
                <li>• Educational projects</li>
                <li>• Personal use</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Need help?</strong> Check out the{" "}
          <a 
            href="https://www.adobe.io/apis/documentcloud/dcsdk/docs.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Adobe PDF Embed API documentation
          </a>{" "}
          for detailed setup instructions and advanced features.
        </AlertDescription>
      </Alert>
    </div>
  )
}
