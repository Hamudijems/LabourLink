import { NextResponse } from "next/server"
import { verifyFaydaID } from "@/lib/fayda-api"

export async function POST(request: Request) {
  const { fin, fan } = await request.json()

  if (!fin || !fan) {
    return NextResponse.json({ success: false, error: "FIN and FAN are required" }, { status: 400 })
  }

  try {
    const result = await verifyFaydaID(fin, fan)
    
    if (result.verified) {
      return NextResponse.json({ 
        success: true, 
        user: {
          fin: result.fin,
          fan: result.fan,
          name: result.name
        }
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || "Invalid FIN/FAN combination" 
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Verification service error" 
    }, { status: 500 })
  }
}
