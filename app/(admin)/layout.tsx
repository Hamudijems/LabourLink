"use client"

import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import { useEffect } from "react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading, logout, adminEmail } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
