import { NextResponse } from "next/server"
import { verifyFaydaID } from "@/lib/fayda-api"

export async function POST(request: Request) {
  try {
    const { fin, fan } = await request.json()
    
    console.log(`📝 API: Received verification request for FIN: ${fin}, FAN: ${fan}`)

    if (!fin || !fan) {
      return NextResponse.json({ 
        success: false, 
        error: "FIN and FAN are required" 
      }, { status: 400 })
    }

    const result = await verifyFaydaID(fin, fan)
    
    if (result.verified) {
      console.log(`✅ API: Verification successful`)
      return NextResponse.json({ 
        success: true, 
        verified: true,
        user: {
          fin: result.fin,
          fan: result.fan,
          name: result.name
        }
      })
    } else {
      console.log(`❌ API: Verification failed - ${result.error}`)
      return NextResponse.json({ 
        success: false, 
        verified: false,
        error: result.error || "Invalid FIN/FAN combination" 
      }, { status: 400 })
    }
  } catch (error) {
    console.error(`💥 API: Verification error:`, error)
    return NextResponse.json({ 
      success: false, 
      verified: false,
      error: "Verification service error. Please try again." 
    }, { status: 500 })
  }
}
