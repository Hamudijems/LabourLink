import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { faydaId } = await request.json()

  // Simulate API call to Fayda ID verification service
  await new Promise((resolve) => setTimeout(resolve, 2000))

  if (faydaId === "123456789") {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: "Invalid Fayda ID" }, { status: 400 })
  }
}
