import { NextResponse } from "next/server"
import { addUser } from "@/services/firebase-services"

export async function POST(request: Request) {
  const { firstName, lastName, email, phone, fin, fan, skills, userType, region, city, companyName, businessType } = await request.json()

  try {
    const userData = {
      fydaId: `${fin}-${fan}`,
      firstName,
      lastName,
      phone,
      email,
      region,
      city,
      userType: userType as "worker" | "employer",
      skills: userType === "worker" ? skills?.split(',').map((s: string) => s.trim()).filter((s: string) => s) : undefined,
      companyName: userType === "employer" ? companyName : undefined,
      businessType: userType === "employer" ? businessType : undefined,
    }

    const userId = await addUser(userData)
    
    return NextResponse.json({ 
      success: true, 
      user: { id: userId, ...userData, status: "pending" }
    })
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 400 })
  }
}
