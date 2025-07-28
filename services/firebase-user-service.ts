import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore"
import { getFirebaseServices } from "../lib/firebase"

export interface FirebaseUser {
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
  registrationDate: Timestamp
  lastActive: Timestamp
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

const USERS_COLLECTION = "users"

export const addUserToFirebase = async (
  userData: Omit<FirebaseUser, "id" | "registrationDate" | "lastActive" | "status">,
): Promise<string> => {
  const { db, ready } = await getFirebaseServices()
  if (!ready || !db) {
    throw new Error("Firebase not available")
  }

  const newUser: Omit<FirebaseUser, "id"> = {
    ...userData,
    registrationDate: Timestamp.now(),
    lastActive: Timestamp.now(),
    status: "pending",
    jobsCompleted: userData.userType === "worker" ? 0 : undefined,
    jobsPosted: 0,
    rating: 0,
    totalEarnings: userData.userType === "worker" ? "0 ETB" : undefined,
  }

  const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser)
  console.log("User added to Firebase with ID: ", docRef.id)
  return docRef.id
}

export const getUsersFromFirebase = async (): Promise<FirebaseUser[]> => {
  const { db, ready } = await getFirebaseServices()
  if (!ready || !db) {
    throw new Error("Firebase not available")
  }

  const q = query(collection(db, USERS_COLLECTION), orderBy("registrationDate", "desc"))
  const querySnapshot = await getDocs(q)
  const users: FirebaseUser[] = []

  querySnapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data(),
    } as FirebaseUser)
  })

  return users
}

export const getUserById = async (userId: string): Promise<FirebaseUser | null> => {
  const { db, ready } = await getFirebaseServices()
  if (!ready || !db) {
    throw new Error("Firebase not available")
  }

  const docRef = doc(db, USERS_COLLECTION, userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as FirebaseUser
  } else {
    return null
  }
}

export const updateUserInFirebase = async (userId: string, updates: Partial<FirebaseUser>): Promise<void> => {
  const { db, ready } = await getFirebaseServices()
  if (!ready || !db) {
    throw new Error("Firebase not available")
  }

  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, {
    ...updates,
    lastActive: Timestamp.now(),
  })
  console.log("User updated in Firebase: ", userId)
}

export const deleteUserFromFirebase = async (userId: string): Promise<void> => {
  const { db, ready } = await getFirebaseServices()
  if (!ready || !db) {
    throw new Error("Firebase not available")
  }

  await deleteDoc(doc(db, USERS_COLLECTION, userId))
  console.log("User deleted from Firebase: ", userId)
}

export const subscribeToUsers = (callback: (users: FirebaseUser[]) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      const { db, ready } = await getFirebaseServices()

      if (!ready || !db) {
        console.warn("⚠️ Firebase not ready for subscribeToUsers")
        callback([])
        return
      }

      const q = query(collection(db, USERS_COLLECTION), orderBy("registrationDate", "desc"))

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const users: FirebaseUser[] = []
          querySnapshot.forEach((doc) => {
            users.push({
              id: doc.id,
              ...doc.data(),
            } as FirebaseUser)
          })
          callback(users)
        },
        (error) => {
          console.error("Error in users subscription: ", error)
          callback([])
        },
      )
    } catch (error) {
      console.error("Failed to set up users subscription:", error)
      callback([])
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

export const subscribeToPendingUsers = (callback: (users: FirebaseUser[]) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      const { db, ready } = await getFirebaseServices()

      if (!ready || !db) {
        console.warn("⚠️ Firebase not ready for subscribeToPendingUsers")
        callback([])
        return
      }

      const q = query(
        collection(db, USERS_COLLECTION),
        where("status", "==", "pending"),
        orderBy("registrationDate", "desc"),
      )

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const users: FirebaseUser[] = []
          querySnapshot.forEach((doc) => {
            users.push({
              id: doc.id,
              ...doc.data(),
            } as FirebaseUser)
          })
          callback(users)
        },
        (error) => {
          console.error("Error in pending users subscription: ", error)
          callback([])
        },
      )
    } catch (error) {
      console.error("Failed to set up pending users subscription:", error)
      callback([])
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}
