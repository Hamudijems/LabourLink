"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  isAuthenticated: boolean
  adminEmail: string | null
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error("Failed to log in", error)
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
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
