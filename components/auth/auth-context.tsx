"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  id: string
}

interface AuthContextType {
  isAuthenticated: boolean
  adminEmail: string | null
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded admin credentials
const ADMIN_EMAIL = "hamudijems4@gmail.com"
const ADMIN_PASSWORD = "ahmed123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check hardcoded credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        email: ADMIN_EMAIL,
        id: "admin-001"
      }
      
      setUser(adminUser)
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
      router.push("/dashboard")
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminUser')
    router.push("/landing")
  }

  const isAuthenticated = !!user
  const adminEmail = user ? user.email : null

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
