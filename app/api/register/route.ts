import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { name, email, password, phone, fin, fan, skills, userType } = await request.json()

  try {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      fin,
      fan,
      skills: userType === "worker" ? skills.split(',').map((s: string) => s.trim()) : [],
      userType: userType || "worker",
      status: "pending",
      isFaydaVerified: true,
      registrationDate: new Date().toISOString().split('T')[0],
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 400 })
  }
}
