"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const createAdminUser = async () => {
    setLoading(true)
    setError("")
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        "hamudijems4@gmail.com", 
        "ahmed123"
      )
      
      console.log("Admin user created:", userCredential.user.uid)
      setSuccess(true)
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Admin user already exists. You can now login.")
      } else {
        setError(`Error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Admin user created successfully! You can now login with:
                <br />Email: hamudijems4@gmail.com
                <br />Password: ahmed123
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Email:</strong> hamudijems4@gmail.com</p>
            <p><strong>Password:</strong> ahmed123</p>
          </div>
          
          <Button 
            onClick={createAdminUser} 
            disabled={loading || success}
            className="w-full"
          >
            {loading ? "Creating..." : success ? "Admin User Created" : "Create Admin User"}
          </Button>
          
          {success && (
            <Button 
              onClick={() => window.location.href = "/login"}
              className="w-full"
              variant="outline"
            >
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}