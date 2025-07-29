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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = initializeFirestore(app, {})
const auth = getAuth(app)

export const getFirebaseServices = async () => {
  return { app, db, auth, ready: true, error: null }
}
