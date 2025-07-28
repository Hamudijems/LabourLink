"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Timestamp } from "firebase/firestore"
import {
  addUser as addUserToFirebase,
  updateUser as updateUserInFirebase,
  deleteUser as deleteUserFromFirebase,
  subscribeToUsers,
  subscribeToPendingUsers,
  type FirebaseUser,
} from "../../services/firebase-services"

export interface User {
  id?: string
  fydaId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  region: string
  city: string
  subcity?: string
  woreda?: string
  kebele?: string
  userType: "worker" | "employer"
  status: "pending" | "verified" | "suspended" | "rejected"
  registrationDate: string
  lastActive: string
  profilePhoto?: string
  skills?: string[]
  experience?: string
  jobsCompleted?: number
  jobsPosted?: number
  rating?: number
  totalEarnings?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  dateOfBirth?: string
  gender?: string
  languages?: string[]
  availability?: string
  preferredJobTypes?: string[]
  expectedWage?: string
  workRadius?: string
  education?: string
  companyName?: string
  businessType?: string
}

interface UserContextType {
  users: User[]
  pendingUsers: User[]
  loading: boolean
  error: string | null
  addUser: (user: Omit<User, "id" | "registrationDate" | "lastActive" | "status">) => Promise<string>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  getUserById: (id: string) => User | undefined
  getUsersByType: (type: "worker" | "employer") => User[]
  refreshUsers: () => void
  clearError: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    ...firebaseUser,
    registrationDate:
      firebaseUser.registrationDate instanceof Timestamp
        ? firebaseUser.registrationDate.toDate().toISOString().split("T")[0]
        : firebaseUser.registrationDate,
    lastActive:
      firebaseUser.lastActive instanceof Timestamp
        ? firebaseUser.lastActive.toDate().toISOString().split("T")[0]
        : firebaseUser.lastActive,
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribeUsers: (() => void) | undefined
    let unsubscribePending: (() => void) | undefined

    try {
      // Subscribe to all users
      unsubscribeUsers = subscribeToUsers((firebaseUsers) => {
        const convertedUsers = firebaseUsers.map(convertFirebaseUserToUser)
        setUsers(convertedUsers)
        setLoading(false)
        setError(null)
      })

      // Subscribe to pending users
      unsubscribePending = subscribeToPendingUsers((firebaseUsers) => {
        const convertedUsers = firebaseUsers.map(convertFirebaseUserToUser)
        setPendingUsers(convertedUsers)
      })
    } catch (err) {
      console.error("Error setting up Firebase listeners:", err)
      setError(`Firebase connection failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      setLoading(false)
    }

    return () => {
      if (unsubscribeUsers) unsubscribeUsers()
      if (unsubscribePending) unsubscribePending()
    }
  }, [])

  const addUser = async (
    userData: Omit<User, "id" | "registrationDate" | "lastActive" | "status">,
  ): Promise<string> => {
    try {
      setError(null)
      const userId = await addUserToFirebase(userData)
      return userId
    } catch (err) {
      console.error("Error adding user:", err)
      setError(`Failed to add user: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
    try {
      setError(null)
      await updateUserInFirebase(id, updates)
    } catch (err) {
      console.error("Error updating user:", err)
      setError(`Failed to update user: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setError(null)
      await deleteUserFromFirebase(id)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError(`Failed to delete user: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const getUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id)
  }

  const getUsersByType = (type: "worker" | "employer"): User[] => {
    return users.filter((user) => user.userType === type)
  }

  const refreshUsers = () => {
    // Real-time listeners automatically refresh data
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <UserContext.Provider
      value={{
        users,
        pendingUsers,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        getUsersByType,
        refreshUsers,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider")
  }
  return context
}
