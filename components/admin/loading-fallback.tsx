"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface LoadingFallbackProps {
  title: string
  description: string
  onRetry?: () => void
  showRetry?: boolean
}

export function LoadingFallback({ 
  title, 
  description, 
  onRetry, 
  showRetry = true 
}: LoadingFallbackProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading data...</h3>
          <p className="text-gray-600 mb-4">This may take a few seconds</p>
          
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <p>If this takes too long, try:</p>
            <ul className="mt-2 space-y-1">
              <li>• Refreshing the page</li>
              <li>• Checking your internet connection</li>
              <li>• Running: <code className="bg-gray-100 px-2 py-1 rounded">node scripts/quick-test-data.js</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}