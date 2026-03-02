import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import * as jose from "jose"

const privateKey = {
  kty: "RSA",
  key_ops: ["sign"],
  kid: "1ddc6a3d-1f0b-4d37-afd5-5fe7a2709d25",
  d: "G-q1WT0DFWB8rtn0HFk5x7j8F9AkCCF7cSBwSXG3eXF54NWeJWTQQuTCuQKpLBaFFuj3rKhdhYV6K5jm0PZzGiOu_fyGjH-n0qwxRiZzicwEQZB13f3uzHTzMcXsOzFfLq5RdaZ9O4RxtDdJ02OTYdOdhq7Hk7a67ZQVG3x49-AmsoQRCMjnjNZfsbHRPd42phaiWxsOeXguScA2SR_EX38vnnocpiz6u2krWUBEAMBMBBsvWcPp33TTgEIWxXRdNGBI1PpdKvDCM5PqN7lgx1UfnHsJ5S8MHTwgNKOlQKRmL9QTrmY1CG8RtoDMmDk2s838LryP8AekrGqEy5DLkQ",
  n: "0bf3qiYoNpFfpKPJYbzzV_GRhTFb8mkSZlHZCKJMEE2adwNeCnsRZr8S7-9wzCC6u60OM_URg1fOXzXy1Wv90dIAFaF406zL6fYZGXZ7uRdNC8I-KiHx_B6CBEIka3Kz99fi1NOHWS-3_wvu9hKV0vg3j6yosrcE0UDxIW5heyXZ7wfFBBdRKinHlVebLMnOEpVaVYr47seAn-A6Qm1JZhsgY4k5-wTJLblfki71qZF0L95-YDzSa56FwMwAupLHi1I6SO6eb_bOJTv8CCr1VMkx2UeOzrchzrrF-NEmK1cf8grXqchARxjfJFo_EiV25psKfL5VtKOdbNBypcVX77MmoQ",
  e: "AQAB",
  p: "_Oy5cZkn00vu9FprOgJeDR36kkWrPCGCCYQCnqBYs2QyWBebOkQHjZ3rIYiyrA685pJ-VSlq1tdtXgVRLS3fMdkwKq2pMTI-v4H1hFpNz6L7AqYxxYgm8X9_sB8Pz4ZfV6J9liky5R2C0gg1jUyMA-WFiv_1fISJk3h1AajuhBs",
  q: "1ETBigHBVymUbjSxVROpr8r-8tEtnBizrupBZXuKNo9UlZyTw2vULM8bI0Wy-ugAYER2TvHsuliC4ISQ4Res0CiBNT9N97HtxbypxzvsH9ZBlwJFam-tZAcearVA7Z1eGW2qzfRImX_DD5ZPraTyEde0yJ-RICi4lAGSfS_LVU_M",
  dp: "BwUfBIsmstOptziHP13vdFe_q62pWgrodN8xKBYtentzB8Tn9w8KT8mFLDIaG3JxRckNHpns-sCXckD5_iUx7pGuNzbFPyP75QRYp64QiMnlW8t8wej3AKyagOK7L1L99eX79u_tppAIMHWTqrRoHFedYE6WqhOPD21eJNgVAIHfpL8",
  dq: "02-pWM5mx2ujbiMOgLAXc-PAEB5MUDBKyvCMM4nbIn2iw2Qzy3Sc5AVoArpqjYKk3VlUf1e0D9aHknuBkiO2smX0HJBNHKHYu-OLeaCTTQeIU0h1-Nl0z1EDWgeRJf8kWr-rs4EaT8vzgJM4yr6CYUN70FshM-db9BGc2RXCdDgE",
  qi: "LmzoWro-QxzmqH5P6h6-XaKsdaLd_eMN32mpdj3yTMqM4_iSSw53ymSqJrVKaq-9xymMuXMRsdyW7F6cQAANxZtfdYQAyazEZMimk_kN-BIP2knsxGrxzDgggSF_TcNZktYxDKQW1PLom2jbH4Yqc7U5CsCzAQFyoDK7c9VknVScX0",
}

const clientId = "GCE-a3iRabzdfqh17DH8LaxhhZKvtarwHc1X3H6mn1k"
const tokenEndpoint = "https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token"
const authorizationEndpoint = "https://esignet.ida.fayda.et/authorize"
const userinfoEndpoint = "https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo"
const redirectUri = "http://localhost:3000/callback"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    // Exchange authorization code for access token
    try {
      const privateJwk = await jose.importJWK(privateKey, "RS256")
      const clientAssertion = await new jose.SignJWT({
        jti: uuidv4(),
        aud: tokenEndpoint,
        iss: clientId,
        sub: clientId,
      })
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(privateJwk)

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: clientAssertion,
        }),
      })

      const data = await response.json()

      if (data.access_token) {
        // Fetch user info
        const userinfoResponse = await fetch(userinfoEndpoint, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        })
        const userinfo = await userinfoResponse.json()
        return NextResponse.json(userinfo)
      } else {
        return NextResponse.json({ error: "Failed to get access token" }, { status: 400 })
      }
    } catch (error) {
      console.error("Error exchanging authorization code:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  } else {
    // Redirect to authorization endpoint
    const state = uuidv4()
    const nonce = uuidv4()
    const authUrl = new URL(authorizationEndpoint)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("scope", "openid profile")
    authUrl.searchParams.set("state", state)
    authUrl.searchParams.set("nonce", nonce)
    return NextResponse.redirect(authUrl)
  }
}
