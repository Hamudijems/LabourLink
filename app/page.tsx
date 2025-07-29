"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push("/landing")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl">Loading...</div>
    </div>
  )
}
