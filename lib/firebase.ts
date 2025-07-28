import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getAnalytics, type Analytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCxhuyDpDVrWGk4hB9hEATRg3KwU9V4Yaw",
  authDomain: "newompitation-project.firebaseapp.com",
  projectId: "newompitation-project",
  storageBucket: "newompitation-project.appspot.com",
  messagingSenderId: "827431642092",
  appId: "1:827431642092:web:7b978f7fa1c70b556656c9",
  measurementId: "G-8482ZXH3GC",
}

let firebaseApp: FirebaseApp | null = null
let firestore: Firestore | null = null
let auth: Auth | null = null
let analytics: Analytics | null = null
let initializationPromise: Promise<boolean> | null = null
let isInitialized = false
let initializationError: Error | null = null

const initializeFirebase = async (): Promise<boolean> => {
  if (isInitialized && firebaseApp && firestore) return true

  try {
    console.log("🔄 Initializing Firebase...")

    // Step 1: Initialize Firebase App
    if (!firebaseApp) {
      firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
      console.log("✅ Firebase App initialized")
    }

    // Step 2: Initialize Firestore
    if (!firestore) {
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        }),
        experimentalForceLongPolling: false
      })
      console.log("✅ Firestore initialized")
    }

    // Step 3: Initialize Auth
    if (!auth) {
      auth = getAuth(firebaseApp)
      console.log("✅ Firebase Auth initialized")
    }

    // Step 4: Initialize Analytics (browser-only with proper error handling)
    if (!analytics && typeof window !== "undefined") {
      try {
        analytics = getAnalytics(firebaseApp)
        console.log("✅ Firebase Analytics initialized")
      } catch (analyticsError) {
        console.warn(
          "⚠️ Firebase Analytics initialization failed (this is normal in some environments):",
          analyticsError,
        )
        // Analytics failure should not prevent the rest of Firebase from working
      }
    } else if (typeof window === "undefined") {
      console.log("ℹ️ Skipping Analytics initialization (server-side environment)")
    }

    isInitialized = true
    initializationError = null
    console.log("🎉 Firebase fully initialized")
    return true
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error)
    firebaseApp = null
    firestore = null
    auth = null
    analytics = null
    isInitialized = false
    initializationError = error as Error
    return false
  }
}

const getInitializationPromise = (): Promise<boolean> => {
  if (!initializationPromise) {
    initializationPromise = initializeFirebase()
  }
  return initializationPromise
}

export const getFirebaseServices = async () => {
  try {
    const initialized = await getInitializationPromise()
    if (initialized) {
      return {
        app: firebaseApp,
        db: firestore,
        auth: auth,
        analytics: analytics,
        ready: true,
        error: null,
      }
    }
  } catch (error) {
    console.warn("⚠️ Firebase services unavailable:", error)
  }

  return {
    app: null,
    db: null,
    auth: null,
    analytics: null,
    ready: false,
    error: initializationError,
  }
}

export const retryFirebaseInitialization = async (): Promise<boolean> => {
  console.log("🔁 Retrying Firebase initialization...")
  initializationPromise = null
  isInitialized = false
  initializationError = null
  firebaseApp = null
  firestore = null
  auth = null
  analytics = null
  return await getInitializationPromise()
}

// Helper function to check if we're in a browser environment
export const isBrowser = (): boolean => {
  return typeof window !== "undefined"
}

// Helper function to get Analytics safely
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (!isBrowser()) {
    console.log("ℹ️ Analytics not available in server environment")
    return null
  }

  try {
    const { analytics, ready } = await getFirebaseServices()
    return ready ? analytics : null
  } catch (error) {
    console.warn("⚠️ Could not get Firebase Analytics:", error)
    return null
  }
}

// Initialize Firebase immediately but don't block on Analytics errors
getInitializationPromise().catch((error) => {
  console.warn("⚠️ Initial Firebase setup failed, will use fallback mode:", error)
})
