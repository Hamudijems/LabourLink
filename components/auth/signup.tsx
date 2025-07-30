"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useUsers } from "../context/user-context"
import { AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyFaydaID } from "@/lib/fayda-api"

const ethiopianRegions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "SNNP",
  "Somali",
  "Tigray",
]

const skillsOptions = [
  "Construction",
  "Carpentry",
  "Plumbing",
  "Electrical Work",
  "Painting",
  "Cleaning",
  "Cooking",
  "Gardening",
  "Security",
  "Driving",
  "General Labor",
  "Masonry",
  "Welding",
  "Tailoring",
  "Hair Styling",
]

export default function Signup() {
  const { addUser } = useUsers()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [faydaVerified, setFaydaVerified] = useState(false)
  const [verifyingFayda, setVerifyingFayda] = useState(false)

  const [formData, setFormData] = useState({
    fin: "",
    fan: "",
    fydaId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    region: "",
    city: "",
    subcity: "",
    woreda: "",
    kebele: "",
    userType: "worker" as "worker" | "employer",
    dateOfBirth: "",
    gender: "",
    skills: [] as string[],
    experience: "",
    languages: [] as string[],
    availability: "",
    preferredJobTypes: [] as string[],
    expectedWage: "",
    workRadius: "",
    education: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    companyName: "",
    businessType: "",
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fin && formData.fan && formData.firstName && formData.lastName && formData.phone && formData.email)
      case 2:
        return !!(formData.region && formData.city)
      case 3:
        return formData.userType === "employer" || !!(formData.dateOfBirth && formData.gender)
      case 4:
        return (
          formData.userType === "employer" ||
          !!(formData.skills.length > 0 && formData.experience && formData.languages.length > 0)
        )
      case 5:
        return (
          formData.userType === "employer" ||
          !!(formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relation)
        )
      default:
        return true
    }
  }

  const verifyFayda = async () => {
    if (!formData.fin || !formData.fan) {
      setError("Please enter both FIN and FAN")
      return
    }

    setVerifyingFayda(true)
    setError("")

    try {
      const result = await verifyFaydaID(formData.fin, formData.fan)
      if (result.verified) {
        setFaydaVerified(true)
        setFormData(prev => ({ ...prev, fydaId: `ET-${formData.fin}` }))
      } else {
        setError(result.error || "Fayda verification failed")
      }
    } catch (err) {
      setError("Verification service error")
    } finally {
      setVerifyingFayda(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !faydaVerified) {
      setError("Please verify your Fayda ID first")
      return
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      setError("")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Please fill in all required fields")
      return
    }

    if (!faydaVerified) {
      setError("Please verify your Fayda ID first")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Save to Firebase
      const userData = {
        ...formData,
        status: "pending",
        faydaVerified: true,
        registrationDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0]
      }
      
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      await addDoc(collection(db, 'users'), userData)
      setSuccess(true)
    } catch (err) {
      setError("Failed to register. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
              <p className="text-gray-600">
                Your account has been created and is pending approval. You will be notified once your account is
                verified.
              </p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Register Another User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Register for EthioWork</CardTitle>
          <CardDescription>
            Step {currentStep} of 5 - {formData.userType === "worker" ? "Worker" : "Employer"} Registration
          </CardDescription>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userType">Account Type</Label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fin">FIN (Fayda ID Number) *</Label>
                      <Input
                        id="fin"
                        value={formData.fin}
                        onChange={(e) => handleInputChange("fin", e.target.value)}
                        placeholder="6140798523917519"
                        disabled={faydaVerified}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fan">FAN (Fayda Access Number) *</Label>
                      <Input
                        id="fan"
                        value={formData.fan}
                        onChange={(e) => handleInputChange("fan", e.target.value)}
                        placeholder="3126894653473958"
                        disabled={faydaVerified}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={verifyFayda}
                      disabled={verifyingFayda || faydaVerified || !formData.fin || !formData.fan}
                      variant={faydaVerified ? "default" : "outline"}
                      className={faydaVerified ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {verifyingFayda ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : faydaVerified ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Verify Fayda ID
                        </>
                      )}
                    </Button>
                    {faydaVerified && (
                      <span className="text-sm text-green-600">✓ Fayda ID verified successfully</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
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
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethiopianRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subcity">Subcity</Label>
                    <Input
                      id="subcity"
                      value={formData.subcity}
                      onChange={(e) => handleInputChange("subcity", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="woreda">Woreda</Label>
                    <Input
                      id="woreda"
                      value={formData.woreda}
                      onChange={(e) => handleInputChange("woreda", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="kebele">Kebele</Label>
                  <Input
                    id="kebele"
                    value={formData.kebele}
                    onChange={(e) => handleInputChange("kebele", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information (Workers only) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {formData.userType === "worker" ? "Personal Information" : "Company Information"}
              </h3>
              {formData.userType === "worker" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No formal education</SelectItem>
                        <SelectItem value="primary">Primary school</SelectItem>
                        <SelectItem value="secondary">Secondary school</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="degree">Bachelor's degree</SelectItem>
                        <SelectItem value="masters">Master's degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Skills and Experience (Workers only) */}
          {currentStep === 4 && formData.userType === "worker" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills and Experience</h3>
              <div className="space-y-4">
                <div>
                  <Label>Skills *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {skillsOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={(checked) => handleArrayChange("skills", skill, checked as boolean)}
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Languages *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Amharic", "Oromo", "Tigrinya", "English", "Arabic", "Somali"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => handleArrayChange("languages", language, checked as boolean)}
                        />
                        <Label htmlFor={language} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Emergency Contact (Workers) or Final Details (Employers) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {formData.userType === "worker" ? "Emergency Contact" : "Final Details"}
              </h3>
              {formData.userType === "worker" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelation">Relationship *</Label>
                    <Select
                      value={formData.emergencyContact.relation}
                      onValueChange={(value) => handleInputChange("emergencyContact.relation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Please review your information and click Register to complete your employer account setup.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || loading}>
              Previous
            </Button>
            {currentStep < 5 ? (
              <Button onClick={handleNext} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
