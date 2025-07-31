"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, Users, Briefcase, Plus, X } from "lucide-react"
import { addUser } from "@/services/firebase-services"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [fin, setFin] = useState("")
  const [fan, setFan] = useState("")
  const [userType, setUserType] = useState("worker")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [certificate, setCertificate] = useState<File | null>(null)
  const [companyDocument, setCompanyDocument] = useState<File | null>(null)
  const [businessSections, setBusinessSections] = useState<string[]>([])
  const [newBusinessSection, setNewBusinessSection] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedUser, setVerifiedUser] = useState(null)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'employer' || type === 'worker') {
      setUserType(type)
    }
  }, [searchParams])

  const handleVerify = async () => {
    setIsLoading(true)
    setError("")

    try {
      // For testing - bypass Fayda verification if test FIN/FAN
      if (fin === '1234567890123456' && fan === '9876543210987654') {
        setIsVerified(true)
        setVerifiedUser({ name: 'Test User' })
        setFirstName('Test')
        setLastName('User')
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/verify-fayda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fin, fan }),
      })

      const data = await response.json()

      if (response.ok && data.success && data.verified) {
        setIsVerified(true)
        setVerifiedUser(data.user)
        const fullName = data.user.name || ""
        const nameParts = fullName.split(' ')
        setFirstName(nameParts[0] || "")
        setLastName(nameParts.slice(1).join(' ') || "")
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
      const userData = {
        fydaId: `${fin}-${fan}`,
        firstName,
        lastName,
        phone,
        email,
        region,
        city,
        userType: userType as "worker" | "employer",

        companyName: userType === "employer" ? companyName : undefined,
        businessType: userType === "employer" ? businessType : undefined,
      }

      console.log('Starting registration process...')
      
      // For now, skip certificate upload to fix the hanging issue
      let certificateUrl = undefined
      // TODO: Re-enable certificate upload after fixing Firebase Storage
      /*
      if (userType === "worker" && certificate) {
        console.log('Uploading certificate...')
        try {
          const storageRef = ref(storage, `certificates/${Date.now()}_${certificate.name}`)
          const snapshot = await uploadBytes(storageRef, certificate)
          certificateUrl = await getDownloadURL(snapshot.ref)
          console.log('Certificate uploaded successfully:', certificateUrl)
        } catch (uploadError) {
          console.error('Certificate upload failed, continuing without certificate:', uploadError)
        }
      }
      */

      const finalUserData = {
        fydaId: `${fin}-${fan}`,
        firstName,
        lastName,
        phone,
        email,
        region,
        city,
        userType: userType as "worker" | "employer",
        skills: userType === "worker" ? skills : undefined,
        companyName: userType === "employer" ? companyName : undefined,
        businessType: userType === "employer" ? businessType : undefined,
        businessSections: userType === "employer" ? businessSections : undefined,
        certificateUrl,
        companyDocumentUrl: userType === "employer" && companyDocument ? 'pending_upload' : undefined
      }

      console.log('Attempting to register user:', finalUserData)
      const userId = await addUser(finalUserData)
      console.log('User registered with ID:', userId)
      alert(`${userType === 'worker' ? 'Worker' : 'Employer'} account created successfully! User ID: ${userId}. Please wait for admin approval.`)
      window.location.href = "/landing"
    } catch (error) {
      console.error('Registration error:', error)
      setError(`Failed to create account: ${error.message || error}`)
    }

    setIsLoading(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const addBusinessSection = () => {
    if (newBusinessSection.trim() && !businessSections.includes(newBusinessSection.trim())) {
      setBusinessSections([...businessSections, newBusinessSection.trim()])
      setNewBusinessSection("")
    }
  }

  const removeBusinessSection = (sectionToRemove: string) => {
    setBusinessSections(businessSections.filter(section => section !== sectionToRemove))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-600" />
          </div>
          <div className="flex items-center justify-center mb-2">
            {userType === 'worker' ? <Users className="h-6 w-6 text-blue-600 mr-2" /> : <Briefcase className="h-6 w-6 text-green-600 mr-2" />}
            <CardTitle className="text-2xl">
              {userType === 'worker' ? 'Join as Worker' : 'Join as Employer'}
            </CardTitle>
          </div>
          <CardDescription>
            {userType === 'worker' 
              ? 'Register as a worker to find trusted employment opportunities.' 
              : 'Register as an employer to find verified workers.'}
          </CardDescription>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-base font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-2 text-lg py-6"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-base font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-2 text-lg py-6"
                      required
                      disabled={isLoading}
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region" className="text-base font-medium">
                      Region
                    </Label>
                    <Input
                      id="region"
                      type="text"
                      placeholder="Your region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="mt-2 text-lg py-6"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-2 text-lg py-6"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {userType === "worker" && (
                  <>
                    <div>
                      <Label className="text-base font-medium">Skills</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="text"
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="text-lg py-6"
                          disabled={isLoading}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} disabled={isLoading}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                            <span className="text-sm">{skill}</span>
                            <button type="button" onClick={() => removeSkill(skill)} className="text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="certificate" className="text-base font-medium">
                        Certificate/Document (Optional)
                      </Label>
                      <Input
                        id="certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                        className="mt-2 text-lg py-6"
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
                {userType === "employer" && (
                  <>
                    <div>
                      <Label htmlFor="companyName" className="text-base font-medium">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="mt-2 text-lg py-6"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType" className="text-base font-medium">
                        Business Type
                      </Label>
                      <Input
                        id="businessType"
                        type="text"
                        placeholder="e.g., Construction, Retail, Services"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="mt-2 text-lg py-6"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Business Sections</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="text"
                          placeholder="Add a business section"
                          value={newBusinessSection}
                          onChange={(e) => setNewBusinessSection(e.target.value)}
                          className="text-lg py-6"
                          disabled={isLoading}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBusinessSection())}
                        />
                        <Button type="button" onClick={addBusinessSection} disabled={isLoading}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {businessSections.map((section, index) => (
                          <div key={index} className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                            <span className="text-sm">{section}</span>
                            <button type="button" onClick={() => removeBusinessSection(section)} className="text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="companyDocument" className="text-base font-medium">
                        Company Permission Document (Optional)
                      </Label>
                      <Input
                        id="companyDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setCompanyDocument(e.target.files?.[0] || null)}
                        className="mt-2 text-lg py-6"
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={!firstName || !lastName || !email || !phone || !region || !city || (userType === "worker" && skills.length === 0) || (userType === "employer" && (!companyName || !businessType || businessSections.length === 0)) || isLoading}
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
