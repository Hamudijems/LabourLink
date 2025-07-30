"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface User {
  email: string
  id: string
  allowedPages?: string[]
}

interface AuthContextType {
  isAuthenticated: boolean
  adminEmail: string | null
  user: User | null
  hasPageAccess: (pageId: string) => boolean
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
    try {
      // Check hardcoded credentials first (full access)
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          email: ADMIN_EMAIL,
          id: "admin-001",
          allowedPages: ['dashboard', 'user-management', 'workers', 'employers', 'student-registration', 'k12-registration', 'student-graduation', 'admin-management', 'property-management']
        }
        
        setUser(adminUser)
        localStorage.setItem('adminUser', JSON.stringify(adminUser))
        router.push("/dashboard")
        return true
      }

      // Try Firebase authentication for created admins
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid
      
      // Check if user is in admins collection
      const q = query(collection(db, "admins"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('User is not an admin')
      }

      const adminData = querySnapshot.docs[0].data()
      const adminUser = {
        email,
        id: userId,
        allowedPages: adminData.allowedPages || []
      }
      
      setUser(adminUser)
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
      router.push("/dashboard")
      return true
    } catch (error: any) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminUser')
    router.push("/landing")
  }

  const isAuthenticated = !!user
  const adminEmail = user ? user.email : null
  
  const hasPageAccess = (pageId: string): boolean => {
    if (!user) return false
    if (!user.allowedPages) return true // Main admin has full access
    return user.allowedPages.includes(pageId)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, user, hasPageAccess, login, logout, loading }}>
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
