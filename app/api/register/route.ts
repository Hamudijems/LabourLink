import { NextResponse } from "next/server"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function POST(request: Request) {
  const { email, password, faydaId, name, phone, skills, experience, education, certifications, cv } = await request.json()

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    let cvUrl = ""
    if (cv) {
      const storage = getStorage()
      const storageRef = ref(storage, `cvs/${user.uid}`)
      const snapshot = await uploadBytes(storageRef, cv)
      cvUrl = await getDownloadURL(snapshot.ref)
    }

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phone,
      faydaId,
      skills,
      experience,
      education,
      certifications,
      cvUrl,
      isFaydaVerified: true,
      isGraduationVerified: false,
      endorsements: [],
    })

    return NextResponse.json({ success: true, userId: user.uid })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 400 })
  }
}
