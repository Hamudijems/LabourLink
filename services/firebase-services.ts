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
  writeBatch,
  increment,
} from "firebase/firestore"
import { db } from "../lib/firebase"

// Collections
export const COLLECTIONS = {
  USERS: "users",
  JOBS: "jobs",
  CONTRACTS: "contracts",
  APPLICATIONS: "applications",
  SYSTEM_METRICS: "system_metrics",
}

// Keep all the same interfaces as before
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
  registrationDate: Timestamp | string
  lastActive: Timestamp | string
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

export interface FirebaseJob {
  id?: string
  title: string
  description: string
  employerId: string
  employerName: string
  location: string
  region: string
  city: string
  wage: string
  wageType: "hourly" | "daily" | "fixed"
  duration: string
  skillsRequired: string[]
  status: "active" | "paused" | "completed" | "cancelled"
  applicants: number
  maxApplicants?: number
  startDate: string
  endDate?: string
  workHours?: string
  requirements?: string
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
}

export interface FirebaseContract {
  id?: string
  jobId: string
  workerId: string
  employerId: string
  jobTitle: string
  workerName: string
  employerName: string
  status: "pending" | "active" | "completed" | "cancelled"
  startDate: string
  endDate?: string
  wage: string
  wageType: "hourly" | "daily" | "fixed"
  totalAmount?: string
  workDescription: string
  terms?: string
  workerSignature?: boolean
  employerSignature?: boolean
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
}

export interface FirebaseApplication {
  id?: string
  jobId: string
  workerId: string
  employerId: string
  workerName: string
  jobTitle: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: Timestamp | string
  message?: string
}

export interface SystemMetrics {
  id?: string
  totalUsers: number
  totalWorkers: number
  totalEmployers: number
  totalJobs: number
  activeJobs: number
  totalContracts: number
  activeContracts: number
  completedContracts: number
  totalEarnings: number
  pendingVerifications: number
  lastUpdated: Timestamp | string
}

// Enhanced mock data with more realistic entries
const getMockUsers = (): FirebaseUser[] => [
  {
    id: "mock-worker-1",
    fydaId: "ET-AA-1234567",
    firstName: "Abebe",
    lastName: "Tadesse",
    phone: "+251911234567",
    email: "abebe.tadesse@example.com",
    region: "Addis Ababa",
    city: "Addis Ababa",
    subcity: "Bole",
    userType: "worker",
    status: "verified",
    registrationDate: "2024-01-10",
    lastActive: "2024-01-28",
    skills: ["Construction", "Carpentry", "General Labor"],
    experience: "intermediate",
    rating: 4.5,
    jobsCompleted: 12,
    totalEarnings: "15000",
    languages: ["Amharic", "English"],
    availability: "full-time",
    expectedWage: "300",
    emergencyContact: {
      name: "Almaz Tadesse",
      phone: "+251922345678",
      relation: "spouse",
    },
  },
  {
    id: "mock-worker-2",
    fydaId: "ET-OR-2345678",
    firstName: "Meron",
    lastName: "Haile",
    phone: "+251933456789",
    email: "meron.haile@example.com",
    region: "Oromia",
    city: "Adama",
    userType: "worker",
    status: "verified",
    registrationDate: "2024-01-15",
    lastActive: "2024-01-27",
    skills: ["Cleaning", "Cooking", "Gardening"],
    experience: "beginner",
    rating: 4.2,
    jobsCompleted: 5,
    totalEarnings: "3500",
    languages: ["Oromo", "Amharic"],
    availability: "part-time",
    expectedWage: "200",
  },
  {
    id: "mock-employer-1",
    fydaId: "ET-AA-7654321",
    firstName: "Dawit",
    lastName: "Bekele",
    phone: "+251944567890",
    email: "dawit@buildcorp.et",
    region: "Addis Ababa",
    city: "Addis Ababa",
    userType: "employer",
    status: "verified",
    registrationDate: "2024-01-05",
    lastActive: "2024-01-28",
    companyName: "BuildCorp Ethiopia",
    businessType: "Construction",
    jobsPosted: 8,
  },
  {
    id: "mock-pending-1",
    fydaId: "ET-TI-9999999",
    firstName: "Hanan",
    lastName: "Mohammed",
    phone: "+251955678901",
    email: "hanan@example.com",
    region: "Tigray",
    city: "Mekelle",
    userType: "worker",
    status: "pending",
    registrationDate: "2024-01-25",
    lastActive: "2024-01-25",
    skills: ["Tailoring", "Hair Styling"],
    experience: "intermediate",
  },
  {
    id: "mock-suspended-1",
    fydaId: "ET-SO-8888888",
    firstName: "Ahmed",
    lastName: "Ali",
    phone: "+251966789012",
    email: "ahmed@example.com",
    region: "Somali",
    city: "Jigjiga",
    userType: "worker",
    status: "suspended",
    registrationDate: "2024-01-20",
    lastActive: "2024-01-22",
    skills: ["Security", "Driving"],
    experience: "experienced",
  },
]

const getMockJobs = (): FirebaseJob[] => [
  {
    id: "mock-job-1",
    title: "Construction Helper Needed",
    description:
      "Looking for experienced construction helper for residential building project. Must have basic construction knowledge and be physically fit.",
    employerId: "mock-employer-1",
    employerName: "BuildCorp Ethiopia",
    location: "Addis Ababa, Bole",
    region: "Addis Ababa",
    city: "Addis Ababa",
    wage: "350",
    wageType: "daily",
    duration: "3 weeks",
    skillsRequired: ["Construction", "General Labor"],
    status: "active",
    applicants: 8,
    startDate: "2024-02-01",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-28",
  },
  {
    id: "mock-job-2",
    title: "House Cleaning Service",
    description:
      "Need reliable and thorough cleaner for weekly house cleaning. Experience with modern cleaning equipment preferred.",
    employerId: "mock-employer-1",
    employerName: "Private Client",
    location: "Addis Ababa, CMC",
    region: "Addis Ababa",
    city: "Addis Ababa",
    wage: "250",
    wageType: "daily",
    duration: "Ongoing",
    skillsRequired: ["Cleaning"],
    status: "active",
    applicants: 5,
    startDate: "2024-02-05",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-27",
  },
  {
    id: "mock-job-3",
    title: "Garden Maintenance",
    description:
      "Seeking experienced gardener for monthly garden maintenance including pruning, planting, and lawn care.",
    employerId: "mock-employer-1",
    employerName: "Residential Complex",
    location: "Addis Ababa, Kazanchis",
    region: "Addis Ababa",
    city: "Addis Ababa",
    wage: "400",
    wageType: "daily",
    duration: "Monthly",
    skillsRequired: ["Gardening"],
    status: "active",
    applicants: 3,
    startDate: "2024-02-10",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-28",
  },
]

const getMockContracts = (): FirebaseContract[] => [
  {
    id: "mock-contract-1",
    jobId: "mock-job-1",
    workerId: "mock-worker-1",
    employerId: "mock-employer-1",
    jobTitle: "Construction Helper",
    workerName: "Abebe Tadesse",
    employerName: "BuildCorp Ethiopia",
    status: "active",
    startDate: "2024-01-15",
    wage: "350",
    wageType: "daily",
    totalAmount: "7350",
    workDescription: "Construction helper for residential building project",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-28",
    workerSignature: true,
    employerSignature: true,
  },
  {
    id: "mock-contract-2",
    jobId: "mock-job-2",
    workerId: "mock-worker-2",
    employerId: "mock-employer-1",
    jobTitle: "House Cleaning Service",
    workerName: "Meron Haile",
    employerName: "Private Client",
    status: "completed",
    startDate: "2024-01-10",
    endDate: "2024-01-24",
    wage: "250",
    wageType: "daily",
    totalAmount: "2000",
    workDescription: "Weekly house cleaning service",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-24",
    workerSignature: true,
    employerSignature: true,
  },
]

const getMockApplications = (): FirebaseApplication[] => [
  {
    id: "mock-app-1",
    jobId: "mock-job-1",
    workerId: "mock-worker-1",
    employerId: "mock-employer-1",
    workerName: "Abebe Tadesse",
    jobTitle: "Construction Helper Needed",
    status: "accepted",
    appliedAt: "2024-01-20",
    message:
      "I have 5 years of construction experience and am available immediately. I have worked on similar residential projects.",
  },
  {
    id: "mock-app-2",
    jobId: "mock-job-2",
    workerId: "mock-worker-2",
    employerId: "mock-employer-1",
    workerName: "Meron Haile",
    jobTitle: "House Cleaning Service",
    status: "pending",
    appliedAt: "2024-01-25",
    message: "I have experience in house cleaning and am very detail-oriented. Available for weekly cleaning.",
  },
  {
    id: "mock-app-3",
    jobId: "mock-job-3",
    workerId: "mock-pending-1",
    employerId: "mock-employer-1",
    workerName: "Hanan Mohammed",
    jobTitle: "Garden Maintenance",
    status: "pending",
    appliedAt: "2024-01-26",
    message: "I have experience with garden maintenance and plant care. Very reliable and hardworking.",
  },
]

// Enhanced safe operation wrapper with better error handling
const safeFirebaseOperation = async (
  operation: () => Promise<any>,
  fallback: any,
  operationName: string,
): Promise<any> => {
  try {
    const { db } = await getFirebaseServices()

    if (!db) {
      throw new Error("Database not available")
    }

    const result = await operation()
    console.log(`✅ Firebase ${operationName} completed successfully`)
    return result
  } catch (error) {
    console.error(`❌ Firebase ${operationName} failed:`, error)
    // For write operations, throw error instead of using fallback
    if (operationName === 'addUser' || operationName === 'updateUser') {
      throw error
    }
    console.warn(`⚠️ Using fallback data for ${operationName}`)
    return fallback
  }
}

// User Services
export const addUser = async (
  userData: Omit<FirebaseUser, "id" | "registrationDate" | "lastActive" | "status">,
): Promise<string> => {
  try {
    if (!db) throw new Error("Database not available")

    const newUser: any = {
      ...userData,
      registrationDate: Timestamp.now(),
      lastActive: Timestamp.now(),
      status: "pending",
      rating: 0,
    }

    // Add type-specific fields only if they have values
    if (userData.userType === "worker") {
      newUser.jobsCompleted = 0
      newUser.totalEarnings = "0"
    } else if (userData.userType === "employer") {
      newUser.jobsPosted = 0
    }

    // Remove undefined fields
    Object.keys(newUser).forEach(key => {
      if (newUser[key] === undefined) {
        delete newUser[key]
      }
    })
    
    // Ensure required fields are present
    if (!newUser.fydaId || !newUser.firstName || !newUser.lastName || !newUser.email) {
      throw new Error('Missing required user fields')
    }

    console.log('Adding user to Firebase:', newUser)
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), newUser)
    console.log('User added successfully with ID:', docRef.id)
    
    return docRef.id
  } catch (error) {
    console.error('Firebase addUser error:', error)
    throw new Error(`Failed to register user: ${error.message}`)
  }
}

export const updateUser = async (userId: string, updates: Partial<FirebaseUser>): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const userRef = doc(db, COLLECTIONS.USERS, userId)
      await updateDoc(userRef, {
        ...updates,
        lastActive: Timestamp.now(),
      })
      await updateSystemMetrics()
    },
    undefined,
    "updateUser",
  )
}

export const deleteUser = async (userId: string): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      await deleteDoc(doc(db, COLLECTIONS.USERS, userId))
      await updateSystemMetrics()
    },
    undefined,
    "deleteUser",
  )
}

export const subscribeToUsers = (callback: (users: FirebaseUser[]) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      if (!db) {
        console.error("❌ Firebase database not available")
        setTimeout(() => callback(getMockUsers()), 100)
        return
      }

      const q = query(collection(db, COLLECTIONS.USERS), orderBy("registrationDate", "desc"))
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const users: FirebaseUser[] = []
          querySnapshot.forEach((doc) => {
            const userData = doc.data() as any
            // Convert Timestamp objects to strings
            const user: FirebaseUser = {
              id: doc.id,
              ...userData,
              registrationDate: userData.registrationDate?.toDate?.() ? userData.registrationDate.toDate().toISOString() : userData.registrationDate,
              lastActive: userData.lastActive?.toDate?.() ? userData.lastActive.toDate().toISOString() : userData.lastActive
            }
            users.push(user)
          })
          console.log(`✅ Users subscription updated: ${users.length} users from Firebase`)
          callback(users)
        },
        (error) => {
          console.error("❌ Users subscription error:", error)
          callback(getMockUsers())
        },
      )
    } catch (error) {
      console.error("❌ Failed to set up users subscription:", error)
      setTimeout(() => callback(getMockUsers()), 100)
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
      if (!db) {
        console.warn("⚠️ Firebase not ready for subscribeToPendingUsers, using mock data")
        const mockPending = getMockUsers().filter((u) => u.status === "pending")
        setTimeout(() => callback(mockPending), 100)
        return
      }

      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("status", "==", "pending"),
        orderBy("registrationDate", "desc"),
      )

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const users: FirebaseUser[] = []
          querySnapshot.forEach((doc) => {
            const userData = doc.data() as any
            const user: FirebaseUser = {
              id: doc.id,
              ...userData,
              registrationDate: userData.registrationDate?.toDate?.() ? userData.registrationDate.toDate().toISOString() : userData.registrationDate,
              lastActive: userData.lastActive?.toDate?.() ? userData.lastActive.toDate().toISOString() : userData.lastActive
            }
            users.push(user)
          })
          console.log(`✅ Pending users subscription updated: ${users.length} pending`)
          callback(users)
        },
        (error) => {
          console.error("❌ Pending users subscription error:", error)
          callback([])
        },
      )
    } catch (error) {
      console.error("❌ Failed to set up pending users subscription:", error)
      setTimeout(() => callback([]), 100)
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

// Job Services
export const addJob = async (
  jobData: Omit<FirebaseJob, "id" | "createdAt" | "updatedAt" | "applicants">,
): Promise<string> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const newJob: Omit<FirebaseJob, "id"> = {
        ...jobData,
        applicants: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.JOBS), newJob)
      await updateSystemMetrics()
      return docRef.id
    },
    `mock-job-${Date.now()}`,
    "addJob",
  )
}

export const subscribeToJobs = (callback: (jobs: FirebaseJob[]) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      const { db, ready } = await getFirebaseServices()

      if (!ready || !db) {
        console.warn("⚠️ Firebase not ready for subscribeToJobs, using mock data")
        setTimeout(() => callback(getMockJobs()), 100)
        return
      }

      const q = query(collection(db, COLLECTIONS.JOBS), orderBy("createdAt", "desc"))
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const jobs: FirebaseJob[] = []
          querySnapshot.forEach((doc) => {
            jobs.push({ id: doc.id, ...doc.data() } as FirebaseJob)
          })
          console.log(`✅ Jobs subscription updated: ${jobs.length} jobs`)
          callback(jobs)
        },
        (error) => {
          console.error("❌ Jobs subscription error:", error)
          callback(getMockJobs())
        },
      )
    } catch (error) {
      console.error("❌ Failed to set up jobs subscription:", error)
      setTimeout(() => callback(getMockJobs()), 100)
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

// Contract Services
export const addContract = async (
  contractData: Omit<FirebaseContract, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const newContract: Omit<FirebaseContract, "id"> = {
        ...contractData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.CONTRACTS), newContract)
      await updateSystemMetrics()
      return docRef.id
    },
    `mock-contract-${Date.now()}`,
    "addContract",
  )
}

export const subscribeToContracts = (callback: (contracts: FirebaseContract[]) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      const { db, ready } = await getFirebaseServices()

      if (!ready || !db) {
        console.warn("⚠️ Firebase not ready for subscribeToContracts, using mock data")
        setTimeout(() => callback(getMockContracts()), 100)
        return
      }

      const q = query(collection(db, COLLECTIONS.CONTRACTS), orderBy("createdAt", "desc"))
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const contracts: FirebaseContract[] = []
          querySnapshot.forEach((doc) => {
            contracts.push({ id: doc.id, ...doc.data() } as FirebaseContract)
          })
          console.log(`✅ Contracts subscription updated: ${contracts.length} contracts`)
          callback(contracts)
        },
        (error) => {
          console.error("❌ Contracts subscription error:", error)
          callback(getMockContracts())
        },
      )
    } catch (error) {
      console.error("❌ Failed to set up contracts subscription:", error)
      setTimeout(() => callback(getMockContracts()), 100)
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

// Application Services
export const addApplication = async (
  applicationData: Omit<FirebaseApplication, "id" | "appliedAt">,
): Promise<string> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const newApplication: Omit<FirebaseApplication, "id"> = {
        ...applicationData,
        appliedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), newApplication)

      // Update job applicant count
      const jobRef = doc(db, COLLECTIONS.JOBS, applicationData.jobId)
      await updateDoc(jobRef, {
        applicants: increment(1),
        updatedAt: Timestamp.now(),
      })

      return docRef.id
    },
    `mock-app-${Date.now()}`,
    "addApplication",
  )
}

// System Metrics Services
export const updateSystemMetrics = async (): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const batch = writeBatch(db)

      // Get counts
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS))
      const jobsSnapshot = await getDocs(collection(db, COLLECTIONS.JOBS))
      const contractsSnapshot = await getDocs(collection(db, COLLECTIONS.CONTRACTS))

      const users = usersSnapshot.docs.map((doc) => doc.data() as FirebaseUser)
      const jobs = jobsSnapshot.docs.map((doc) => doc.data() as FirebaseJob)
      const contracts = contractsSnapshot.docs.map((doc) => doc.data() as FirebaseContract)

      const metrics: Omit<SystemMetrics, "id"> = {
        totalUsers: users.length,
        totalWorkers: users.filter((u) => u.userType === "worker").length,
        totalEmployers: users.filter((u) => u.userType === "employer").length,
        totalJobs: jobs.length,
        activeJobs: jobs.filter((j) => j.status === "active").length,
        totalContracts: contracts.length,
        activeContracts: contracts.filter((c) => c.status === "active").length,
        completedContracts: contracts.filter((c) => c.status === "completed").length,
        totalEarnings: contracts
          .filter((c) => c.status === "completed")
          .reduce((sum, c) => sum + (Number.parseFloat(c.totalAmount || "0") || 0), 0),
        pendingVerifications: users.filter((u) => u.status === "pending").length,
        lastUpdated: Timestamp.now(),
      }

      const metricsRef = doc(db, COLLECTIONS.SYSTEM_METRICS, "current")
      batch.set(metricsRef, metrics)

      await batch.commit()
    },
    undefined,
    "updateSystemMetrics",
  )
}

export const subscribeToSystemMetrics = (callback: (metrics: SystemMetrics | null) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null

  const setupSubscription = async () => {
    try {
      const { db, ready } = await getFirebaseServices()

      if (!ready || !db) {
        console.warn("⚠️ Firebase not ready for subscribeToSystemMetrics, using mock data")
        const mockMetrics: SystemMetrics = {
          id: "mock-metrics",
          totalUsers: getMockUsers().length,
          totalWorkers: getMockUsers().filter((u) => u.userType === "worker").length,
          totalEmployers: getMockUsers().filter((u) => u.userType === "employer").length,
          totalJobs: getMockJobs().length,
          activeJobs: getMockJobs().filter((j) => j.status === "active").length,
          totalContracts: getMockContracts().length,
          activeContracts: getMockContracts().filter((c) => c.status === "active").length,
          completedContracts: getMockContracts().filter((c) => c.status === "completed").length,
          totalEarnings: getMockContracts()
            .filter((c) => c.status === "completed")
            .reduce((sum, c) => sum + (Number.parseFloat(c.totalAmount || "0") || 0), 0),
          pendingVerifications: getMockUsers().filter((u) => u.status === "pending").length,
          lastUpdated: new Date().toISOString(),
        }
        setTimeout(() => callback(mockMetrics), 100)
        return
      }

      const docRef = doc(db, COLLECTIONS.SYSTEM_METRICS, "current")
      unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            const metrics = { id: doc.id, ...doc.data() } as SystemMetrics
            console.log("✅ System metrics subscription updated")
            callback(metrics)
          } else {
            callback(null)
          }
        },
        (error) => {
          console.error("❌ System metrics subscription error:", error)
          callback(null)
        },
      )
    } catch (error) {
      console.error("❌ Failed to set up system metrics subscription:", error)
      setTimeout(() => callback(null), 100)
    }
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

// Additional required exports for compatibility
export const updateJob = async (jobId: string, updates: Partial<FirebaseJob>): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const jobRef = doc(db, COLLECTIONS.JOBS, jobId)
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
      await updateSystemMetrics()
    },
    undefined,
    "updateJob",
  )
}

export const deleteJob = async (jobId: string): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      await deleteDoc(doc(db, COLLECTIONS.JOBS, jobId))
      await updateSystemMetrics()
    },
    undefined,
    "deleteJob",
  )
}

export const updateContract = async (contractId: string, updates: Partial<FirebaseContract>): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const contractRef = doc(db, COLLECTIONS.CONTRACTS, contractId)
      await updateDoc(contractRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
      await updateSystemMetrics()
    },
    undefined,
    "updateContract",
  )
}

export const updateApplication = async (
  applicationId: string,
  updates: Partial<FirebaseApplication>,
): Promise<void> => {
  return safeFirebaseOperation(
    async () => {
      const { db } = await getFirebaseServices()
      if (!db) throw new Error("Database not available")

      const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId)
      await updateDoc(applicationRef, updates)
    },
    undefined,
    "updateApplication",
  )
}
