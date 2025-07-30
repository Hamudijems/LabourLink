"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [fin, setFin] = useState("")
  const [fan, setFan] = useState("")
  const [userType, setUserType] = useState("worker")
  const [skills, setSkills] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedUser, setVerifiedUser] = useState(null)

  const handleVerify = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/verify-fayda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fin, fan }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setVerifiedUser(data.user)
        setName(data.user.name || "")
      } else {
        setError(data.error || "Invalid FIN/FAN combination. Please try again.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, fin, fan, skills, userType }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Store user in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        existingUsers.push(data.user)
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
        
        alert("Account created successfully! You can now login.")
        window.location.href = "/login"
      } else {
        setError(data.error || "Failed to register user")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join SafeHire Ethiopia and get access to a trusted workforce.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isVerified ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userType" className="text-base font-medium">
                    Registration Type
                  </Label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full mt-2 text-lg py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="worker">Join as Worker</option>
                    <option value="employer">Join as Employer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="fin" className="text-base font-medium">
                    FIN (Fayda Identification Number)
                  </Label>
                  <Input
                    id="fin"
                    type="text"
                    placeholder="Enter your FIN"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="fan" className="text-base font-medium">
                    FAN (Fayda Account Number)
                  </Label>
                  <Input
                    id="fan"
                    type="text"
                    placeholder="Enter your FAN"
                    value={fan}
                    onChange={(e) => setFan(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={!fin || !fan || isLoading}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {isLoading ? "Verifying..." : "Verify Fayda ID"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-base font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 text-lg py-6"
                    required
                    disabled={isLoading}
                  />
                </div>
                {userType === "worker" && (
                  <div>
                    <Label htmlFor="skills" className="text-base font-medium">
                      Skills
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="Enter your skills (comma-separated)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="mt-2 text-lg py-6"
                      required={userType === "worker"}
                      disabled={isLoading}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={!name || !email || !password || !phone || (userType === "worker" && !skills) || isLoading}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
