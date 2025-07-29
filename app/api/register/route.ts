import { NextResponse } from "next/server"
import { getFirebaseServices } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

export async function POST(request: Request) {
  const { email, password, faydaId, skills } = await request.json()

  try {
    const { auth, db } = await getFirebaseServices()

    if (!auth || !db) {
      return NextResponse.json({ success: false, error: "Firebase services not available" }, { status: 500 })
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, "users", user.uid), {
      faydaId,
      skills,
      isFaydaVerified: true,
    })

    return NextResponse.json({ success: true, userId: user.uid })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 400 })
  }
}
