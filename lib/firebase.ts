import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCxhuyDpDVrWGk4hB9hEATRg3KwU9V4Yaw",
  authDomain: "newompitation-project.firebaseapp.com",
  projectId: "newompitation-project",
  storageBucket: "newompitation-project.firebasestorage.app",
  messagingSenderId: "827431642092",
  appId: "1:827431642092:web:4c19b1ac64a89cf76656c9",
  measurementId: "G-6XY76L7G4B"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Suppress WebChannel transport errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override console.warn to filter Firebase WebChannel errors
  const originalWarn = console.warn
  console.warn = (...args) => {
    const message = args.join(' ')
    if (message.includes('WebChannelConnection') || message.includes('transport errored')) {
      return // Suppress these specific warnings
    }
    originalWarn.apply(console, args)
  }
}

// Connection status monitoring with retry logic
export const checkFirestoreConnection = async () => {
  try {
    const { enableNetwork, disableNetwork, connectFirestoreEmulator } = await import('firebase/firestore')
    
    // Simple connection test
    await enableNetwork(db)
    return true
  } catch (error) {
    // Silently handle connection errors
    return false
  }
}

// Enhanced error handling for Firebase operations
export const withFirebaseErrorHandling = async (operation: () => Promise<any>) => {
  try {
    return await operation()
  } catch (error: any) {
    console.error('Firebase operation error:', error)
    // Handle specific Firebase errors
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
      throw new Error('Network connection issue. Please check your internet connection.')
    }
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your authentication.')
    }
    throw error
  }
}

export { auth, db }
