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
  Timestamp,
} from "firebase/firestore"
import { db } from "../lib/firebase"

// Collections
export const STUDENT_COLLECTIONS = {
  STUDENTS: "students",
  K12_STUDENTS: "k12Students",
}

// Interfaces
export interface FirebaseStudent {
  id?: string
  fin: string
  fan: string
  firstName: string
  lastName: string
  email: string
  phone: string
  institution: string
  program: string
  startDate: string
  expectedGraduation: string
  status: "active" | "graduated" | "dropped"
  faydaVerified: boolean
  registrationDate: string
  createdAt?: Timestamp | string
}

export interface FirebaseK12Student {
  id?: string
  parentFin: string
  parentFan: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  school: string
  parentName: string
  parentEmail: string
  parentPhone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  status: "enrolled" | "transferred" | "graduated"
  faydaVerified: boolean
  registrationDate: string
  createdAt?: Timestamp | string
}



// Student Services
export const addStudent = async (
  studentData: Omit<FirebaseStudent, "id" | "createdAt">
): Promise<string> => {
  console.log('addStudent called with:', studentData)
  
  try {
    if (!db) {
      throw new Error('Firebase database not initialized')
    }

    console.log('Attempting to add student to Firebase...')

    const newStudent = {
      ...studentData,
      createdAt: new Date().toISOString(), // Use string instead of Timestamp for simplicity
    }

    console.log('Adding to collection:', STUDENT_COLLECTIONS.STUDENTS)
    console.log('Student data:', newStudent)
    
    const docRef = await addDoc(collection(db, STUDENT_COLLECTIONS.STUDENTS), newStudent)
    console.log('✅ Student added successfully with ID:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ addStudent failed:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    throw error
  }
}

export const subscribeToStudents = (callback: (students: FirebaseStudent[]) => void): (() => void) => {
  if (!db) {
    console.error('Firebase database not initialized')
    callback([])
    return () => {}
  }

  console.log('Creating subscription to collection:', STUDENT_COLLECTIONS.STUDENTS)
  const studentsRef = collection(db, STUDENT_COLLECTIONS.STUDENTS)
  
  const unsubscribe = onSnapshot(
    studentsRef,
    (querySnapshot) => {
      console.log('Snapshot received, docs count:', querySnapshot.size)
      const students: FirebaseStudent[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Document data:', doc.id, data)
        students.push({ id: doc.id, ...data } as FirebaseStudent)
      })
      console.log(`✅ Students subscription updated: ${students.length} students`)
      callback(students)
    },
    (error) => {
      console.error("❌ Students subscription error:", error)
      callback([])
    },
  )

  return unsubscribe
}

// K-12 Student Services
export const addK12Student = async (
  studentData: Omit<FirebaseK12Student, "id" | "createdAt">
): Promise<string> => {
  console.log('addK12Student called with:', studentData)
  
  try {
    if (!db) {
      throw new Error('Firebase database not initialized')
    }

    console.log('Attempting to add K-12 student to Firebase...')

    const newStudent = {
      ...studentData,
      createdAt: new Date().toISOString(),
    }

    console.log('Adding K-12 student to collection:', STUDENT_COLLECTIONS.K12_STUDENTS)
    const docRef = await addDoc(collection(db, STUDENT_COLLECTIONS.K12_STUDENTS), newStudent)
    console.log('✅ K-12 Student added successfully with ID:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ addK12Student failed:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    throw error
  }
}

export const subscribeToK12Students = (callback: (students: FirebaseK12Student[]) => void): (() => void) => {
  if (!db) {
    console.error('Firebase database not initialized')
    callback([])
    return () => {}
  }

  const studentsRef = collection(db, STUDENT_COLLECTIONS.K12_STUDENTS)
  
  const unsubscribe = onSnapshot(
    studentsRef,
    (querySnapshot) => {
      const students: FirebaseK12Student[] = []
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as FirebaseK12Student)
      })
      console.log(`✅ K-12 students subscription updated: ${students.length} students`)
      callback(students)
    },
    (error) => {
      console.error("❌ K-12 students subscription error:", error)
      callback([])
    },
  )

  return unsubscribe
}

// Update functions
export const updateStudent = async (studentId: string, updates: Partial<FirebaseStudent>): Promise<void> => {
  if (!db) throw new Error('Firebase database not initialized')
  
  const studentRef = doc(db, STUDENT_COLLECTIONS.STUDENTS, studentId)
  await updateDoc(studentRef, updates)
}

export const updateK12Student = async (studentId: string, updates: Partial<FirebaseK12Student>): Promise<void> => {
  if (!db) throw new Error('Firebase database not initialized')
  
  const studentRef = doc(db, STUDENT_COLLECTIONS.K12_STUDENTS, studentId)
  await updateDoc(studentRef, updates)
}