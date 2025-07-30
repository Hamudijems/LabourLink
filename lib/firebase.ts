import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCxhuyDpDVrWGk4hB9hEATRg3KwU9V4Yaw",
  authDomain: "newompitation-project.firebaseapp.com",
  projectId: "newompitation-project",
  storageBucket: "newompitation-project.appspot.com",
  messagingSenderId: "827431642092",
  appId: "1:827431642092:web:7b978f7fa1c70b556656c9",
  measurementId: "G-8482ZXH3GC"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
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
    // Handle specific Firebase errors
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
      // Network issues - retry once
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return await operation()
      } catch (retryError) {
        throw new Error('Network connection issue. Please check your internet connection.')
      }
    }
    throw error
  }
}

export { auth, db }
