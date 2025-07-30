"use client"

import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission: string
  fallbackPath?: string
}

export default function PermissionGuard({ 
  children, 
  requiredPermission, 
  fallbackPath = "/dashboard" 
}: PermissionGuardProps) {
  const { hasPermission, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated && !hasPermission(requiredPermission)) {
      router.push(fallbackPath)
    }
  }, [hasPermission, requiredPermission, fallbackPath, router, loading, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}