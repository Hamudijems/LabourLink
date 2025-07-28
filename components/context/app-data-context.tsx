"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Timestamp } from "firebase/firestore"
import {
  subscribeToJobs,
  subscribeToContracts,
  subscribeToSystemMetrics,
  addJob as addJobToFirebase,
  updateJob as updateJobInFirebase,
  deleteJob as deleteJobFromFirebase,
  addContract as addContractToFirebase,
  updateContract as updateContractInFirebase,
  addApplication as addApplicationToFirebase,
  updateApplication as updateApplicationInFirebase,
  type FirebaseJob,
  type FirebaseContract,
  type SystemMetrics,
  type FirebaseApplication,
} from "../../services/firebase-services"

export interface Job {
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
  createdAt: string
  updatedAt: string
}

export interface Contract {
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
  createdAt: string
  updatedAt: string
}

export interface Application {
  id?: string
  jobId: string
  workerId: string
  employerId: string
  workerName: string
  jobTitle: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: string
  message?: string
}

interface AppDataContextType {
  jobs: Job[]
  contracts: Contract[]
  applications: Application[]
  systemMetrics: SystemMetrics | null
  loading: boolean
  error: string | null
  addJob: (job: Omit<Job, "id" | "createdAt" | "updatedAt" | "applicants">) => Promise<string>
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  addContract: (contract: Omit<Contract, "id" | "createdAt" | "updatedAt">) => Promise<string>
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>
  addApplication: (application: Omit<Application, "id" | "appliedAt">) => Promise<string>
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>
  getJobsByEmployer: (employerId: string) => Job[]
  getContractsByWorker: (workerId: string) => Contract[]
  getContractsByEmployer: (employerId: string) => Contract[]
  getApplicationsByJob: (jobId: string) => Application[]
  clearError: () => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

const convertFirebaseJobToJob = (firebaseJob: FirebaseJob): Job => {
  return {
    ...firebaseJob,
    createdAt:
      firebaseJob.createdAt instanceof Timestamp
        ? firebaseJob.createdAt.toDate().toISOString().split("T")[0]
        : firebaseJob.createdAt,
    updatedAt:
      firebaseJob.updatedAt instanceof Timestamp
        ? firebaseJob.updatedAt.toDate().toISOString().split("T")[0]
        : firebaseJob.updatedAt,
  }
}

const convertFirebaseContractToContract = (firebaseContract: FirebaseContract): Contract => {
  return {
    ...firebaseContract,
    createdAt:
      firebaseContract.createdAt instanceof Timestamp
        ? firebaseContract.createdAt.toDate().toISOString().split("T")[0]
        : firebaseContract.createdAt,
    updatedAt:
      firebaseContract.updatedAt instanceof Timestamp
        ? firebaseContract.updatedAt.toDate().toISOString().split("T")[0]
        : firebaseContract.updatedAt,
  }
}

const convertFirebaseApplicationToApplication = (firebaseApplication: FirebaseApplication): Application => {
  return {
    ...firebaseApplication,
    appliedAt:
      firebaseApplication.appliedAt instanceof Timestamp
        ? firebaseApplication.appliedAt.toDate().toISOString().split("T")[0]
        : firebaseApplication.appliedAt,
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined
    let unsubscribeContracts: (() => void) | undefined
    let unsubscribeMetrics: (() => void) | undefined

    try {
      // Subscribe to jobs
      unsubscribeJobs = subscribeToJobs((firebaseJobs) => {
        const convertedJobs = firebaseJobs.map(convertFirebaseJobToJob)
        setJobs(convertedJobs)
        setLoading(false)
        setError(null)
      })

      // Subscribe to contracts
      unsubscribeContracts = subscribeToContracts((firebaseContracts) => {
        const convertedContracts = firebaseContracts.map(convertFirebaseContractToContract)
        setContracts(convertedContracts)
      })

      // Subscribe to system metrics
      unsubscribeMetrics = subscribeToSystemMetrics((metrics) => {
        setSystemMetrics(metrics)
      })
    } catch (err) {
      console.error("Error setting up Firebase listeners:", err)
      setError(`Firebase connection failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      setLoading(false)
    }

    return () => {
      if (unsubscribeJobs) unsubscribeJobs()
      if (unsubscribeContracts) unsubscribeContracts()
      if (unsubscribeMetrics) unsubscribeMetrics()
    }
  }, [])

  const addJob = async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "applicants">): Promise<string> => {
    try {
      setError(null)
      const jobId = await addJobToFirebase(jobData)
      return jobId
    } catch (err) {
      console.error("Error adding job:", err)
      setError(`Failed to add job: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const updateJob = async (id: string, updates: Partial<Job>): Promise<void> => {
    try {
      setError(null)
      await updateJobInFirebase(id, updates)
    } catch (err) {
      console.error("Error updating job:", err)
      setError(`Failed to update job: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const deleteJob = async (id: string): Promise<void> => {
    try {
      setError(null)
      await deleteJobFromFirebase(id)
    } catch (err) {
      console.error("Error deleting job:", err)
      setError(`Failed to delete job: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const addContract = async (contractData: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<string> => {
    try {
      setError(null)
      const contractId = await addContractToFirebase(contractData)
      return contractId
    } catch (err) {
      console.error("Error adding contract:", err)
      setError(`Failed to add contract: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const updateContract = async (id: string, updates: Partial<Contract>): Promise<void> => {
    try {
      setError(null)
      await updateContractInFirebase(id, updates)
    } catch (err) {
      console.error("Error updating contract:", err)
      setError(`Failed to update contract: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const addApplication = async (applicationData: Omit<Application, "id" | "appliedAt">): Promise<string> => {
    try {
      setError(null)
      const applicationId = await addApplicationToFirebase(applicationData)
      return applicationId
    } catch (err) {
      console.error("Error adding application:", err)
      setError(`Failed to add application: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const updateApplication = async (id: string, updates: Partial<Application>): Promise<void> => {
    try {
      setError(null)
      await updateApplicationInFirebase(id, updates)
    } catch (err) {
      console.error("Error updating application:", err)
      setError(`Failed to update application: ${err instanceof Error ? err.message : "Unknown error"}`)
      throw err
    }
  }

  const getJobsByEmployer = (employerId: string): Job[] => {
    return jobs.filter((job) => job.employerId === employerId)
  }

  const getContractsByWorker = (workerId: string): Contract[] => {
    return contracts.filter((contract) => contract.workerId === workerId)
  }

  const getContractsByEmployer = (employerId: string): Contract[] => {
    return contracts.filter((contract) => contract.employerId === employerId)
  }

  const getApplicationsByJob = (jobId: string): Application[] => {
    return applications.filter((application) => application.jobId === jobId)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AppDataContext.Provider
      value={{
        jobs,
        contracts,
        applications,
        systemMetrics,
        loading,
        error,
        addJob,
        updateJob,
        deleteJob,
        addContract,
        updateContract,
        addApplication,
        updateApplication,
        getJobsByEmployer,
        getContractsByWorker,
        getContractsByEmployer,
        getApplicationsByJob,
        clearError,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}
