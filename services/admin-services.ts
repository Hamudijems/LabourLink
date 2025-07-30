import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface AdminUser {
  id: string
  email: string
  permissions: string[]
  createdAt: string
  lastLogin?: string
}

const ADMINS_COLLECTION = "admins"

export const createAdmin = async (email: string, password: string, permissions: string[]): Promise<string> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userId = userCredential.user.uid

    // Store admin data in Firestore
    const adminData = {
      email,
      permissions,
      createdAt: new Date().toISOString(),
      userId
    }

    await setDoc(doc(db, ADMINS_COLLECTION, userId), adminData)
    
    console.log('Admin created successfully:', userId)
    return userId
  } catch (error: any) {
    console.error('Failed to create admin:', error)
    throw new Error(error.message || 'Failed to create admin')
  }
}

export const getAdmins = async (): Promise<AdminUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, ADMINS_COLLECTION))
    const admins: AdminUser[] = []
    
    querySnapshot.forEach((doc) => {
      admins.push({
        id: doc.id,
        ...doc.data()
      } as AdminUser)
    })
    
    return admins
  } catch (error) {
    console.error('Failed to get admins:', error)
    return []
  }
}

export const getAdminPermissions = async (userId: string): Promise<string[]> => {
  try {
    const adminDoc = await getDocs(collection(db, ADMINS_COLLECTION))
    const admin = adminDoc.docs.find(doc => doc.id === userId)
    
    if (admin) {
      return admin.data().permissions || []
    }
    
    return []
  } catch (error) {
    console.error('Failed to get admin permissions:', error)
    return []
  }
}

export const updateAdminPermissions = async (adminId: string, permissions: string[]): Promise<void> => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, adminId)
    await updateDoc(adminRef, { permissions })
  } catch (error) {
    console.error('Failed to update admin permissions:', error)
    throw error
  }
}

export const deleteAdmin = async (adminId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ADMINS_COLLECTION, adminId))
  } catch (error) {
    console.error('Failed to delete admin:', error)
    throw error
  }
}

export const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, userId)
    await updateDoc(adminRef, { 
      lastLogin: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Failed to update last login:', error)
  }
}