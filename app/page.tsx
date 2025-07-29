"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"

export default function Page() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl">Loading...</div>
    </div>
  )
}
