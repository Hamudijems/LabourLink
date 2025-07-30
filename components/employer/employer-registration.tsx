"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addUser } from "@/services/firebase-services"
import { AlertCircle, CheckCircle2, Loader2, Building2 } from "lucide-react"

interface EmployerRegistrationProps {
  onComplete?: () => void
}

function EmployerRegistrationComponent({ onComplete }: EmployerRegistrationProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [fydaVerified, setFydaVerified] = useState(false)
  const [verifyingFyda, setVerifyingFyda] = useState(false)

  const [formData, setFormData] = useState({
    fin: "",
    fan: "",
    companyName: "",
    contactPersonName: "",
    phone: "",
    email: "",
    businessType: "",
    address: "",
    city: "",
    region: "",
    firstName: "",
    lastName: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const verifyFydaId = async () => {
    console.log('🔍 Starting verification with FIN:', formData.fin, 'FAN:', formData.fan)
    
    if (!formData.fin || !formData.fan) {
      setError("Please enter both FIN and FAN")
      return
    }

    if (formData.fin.length < 10 || formData.fan.length < 10) {
      setError("FIN and FAN must be at least 10 digits")
      return
    }

    setVerifyingFyda(true)
    setError("")

    try {
      console.log('📡 Making API request...')
      const response = await fetch("/api/verify-fayda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fin: formData.fin.trim(), fan: formData.fan.trim() }),
      })

      const data = await response.json()
      console.log('📥 Verification response:', data)

      if (data.success === true || data.verified === true) {
        console.log('✅ Verification successful!')
        setFydaVerified(true)
        setError("")
        // Auto-fill name if available
        if (data.user?.name) {
          const nameParts = data.user.name.split(' ')
          setFormData(prev => ({
            ...prev,
            contactPersonName: data.user.name,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
          }))
        }
      } else {
        console.log('❌ Verification failed:', data.error)
        setError(data.error || "Invalid FIN/FAN combination. Try: FIN: 6140798523917519, FAN: 3126894653473958")
        setFydaVerified(false)
      }
    } catch (error) {
      console.error('💥 Verification error:', error)
      setError("Verification service error. Please try again.")
      setFydaVerified(false)
    } finally {
      setVerifyingFyda(false)
    }
  }

  const handleSubmit = async () => {
    if (!fydaVerified) {
      setError("Please verify your Fayda ID first")
      return
    }

    if (!formData.companyName || !formData.contactPersonName || !formData.phone || !formData.email) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      await addUser({
        fydaId: formData.fin,
        firstName: formData.firstName || formData.contactPersonName.split(' ')[0] || '',
        lastName: formData.lastName || formData.contactPersonName.split(' ').slice(1).join(' ') || '',
        phone: formData.phone,
        email: formData.email,
        region: formData.region,
        city: formData.city,
        userType: "employer",
        companyName: formData.companyName,
        businessType: formData.businessType,
      })
      setSuccess(true)
      if (onComplete) {
        setTimeout(onComplete, 2000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to register employer: ${errorMessage}`)
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">Employer Registered Successfully!</h2>
            <p className="text-gray-600">
              {formData.companyName} has been registered and is pending verification.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> {formData.companyName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Contact Person:</strong> {formData.contactPersonName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>FIN:</strong> {formData.fin}
              </p>
              <p className="text-sm text-gray-600">
                <strong>FAN:</strong> {formData.fan}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Register as Employer
        </CardTitle>
        <CardDescription>
          Register your company to post jobs and hire workers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Fayda ID Verification */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fayda ID Verification</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fin">FIN (Fayda Identification Number) *</Label>
              <Input
                id="fin"
                value={formData.fin}
                onChange={(e) => handleInputChange("fin", e.target.value)}
                placeholder="Enter your FIN"
                disabled={fydaVerified}
              />
            </div>
            <div>
              <Label htmlFor="fan">FAN (Fayda Account Number) *</Label>
              <Input
                id="fan"
                value={formData.fan}
                onChange={(e) => handleInputChange("fan", e.target.value)}
                placeholder="Enter your FAN"
                disabled={fydaVerified}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <p><strong>Test Credentials:</strong></p>
              <p>FIN: 6140798523917519, FAN: 3126894653473958</p>
              <p>FIN: 6230247319356120, FAN: 1234567890123456</p>
            </div>
            <Button
              onClick={verifyFydaId}
              disabled={verifyingFyda || fydaVerified || !formData.fin || !formData.fan}
              variant={fydaVerified ? "default" : "outline"}
              className={`w-full ${fydaVerified ? 'bg-green-600 hover:bg-green-700' : ''}`}
              type="button"
            >
              {verifyingFyda ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : fydaVerified ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verified ✓
                </>
              ) : (
                "Verify Fayda ID"
              )}
            </Button>
          </div>

          {fydaVerified && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Fayda ID verified successfully!</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Company Information */}
        {fydaVerified && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  placeholder="e.g., Construction, Manufacturing"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter business address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Enter region"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {fydaVerified && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+251911234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        {fydaVerified && (
          <div className="pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Employer...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export with dynamic import to prevent SSR issues
const EmployerRegistration = dynamic(() => Promise.resolve(EmployerRegistrationComponent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading registration form...</p>
      </div>
    </div>
  )
})

export default EmployerRegistration