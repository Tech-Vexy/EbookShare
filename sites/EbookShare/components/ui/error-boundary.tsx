"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full glass">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription className="text-base">
                We apologize for the inconvenience. An unexpected error has occurred.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error details in development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Alert variant="destructive">
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="font-mono text-sm">
                    <details className="mt-2">
                      <summary className="cursor-pointer font-sans font-medium mb-2">
                        Error Details (Development Only)
                      </summary>
                      <div className="whitespace-pre-wrap text-xs bg-destructive/5 p-3 rounded border">
                        <strong>Error:</strong> {this.state.error.message}
                        {this.state.error.stack && (
                          <>
                            <br />
                            <br />
                            <strong>Stack Trace:</strong>
                            <br />
                            {this.state.error.stack}
                          </>
                        )}
                        {this.state.errorInfo?.componentStack && (
                          <>
                            <br />
                            <br />
                            <strong>Component Stack:</strong>
                            <br />
                            {this.state.errorInfo.componentStack}
                          </>
                        )}
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={this.handleReset}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  If this problem persists, please{" "}
                  <a 
                    href="mailto:support@example.com" 
                    className="text-primary hover:underline"
                  >
                    contact support
                  </a>{" "}
                  or{" "}
                  <a 
                    href="https://github.com/your-repo/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    report an issue
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo)
    
    // In production, log to error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: logErrorToService(error, errorInfo)
    }
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return ComponentWithErrorBoundary
}

// Specialized error boundaries for different parts of the app
export function CatalogErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to load catalog</h3>
          <p className="text-muted-foreground mb-4">
            There was an issue loading the ebook catalog. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function UploadErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Error</h3>
          <p className="text-muted-foreground mb-4">
            There was an issue with the upload feature. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dashboard Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            There was an issue loading your dashboard. Please try refreshing.
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
