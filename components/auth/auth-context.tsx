"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  adminEmail: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  const login = (email: string, password: string): boolean => {
    // Check credentials
    if (email === "hamudijems4@gmail.com" && password === "ahmed123") {
      setIsAuthenticated(true)
      setAdminEmail(email)
      // Store in localStorage for persistence
      localStorage.setItem("adminAuth", JSON.stringify({ email, authenticated: true }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdminEmail(null)
    localStorage.removeItem("adminAuth")
  }

  // Check for existing auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("adminAuth")
      if (stored) {
        try {
          const { email, authenticated } = JSON.parse(stored)
          if (authenticated) {
            setIsAuthenticated(true)
            setAdminEmail(email)
          }
        } catch (error) {
          localStorage.removeItem("adminAuth")
        }
      }
    }
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
