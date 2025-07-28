"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useUsers } from "../context/user-context"
import { AlertCircle, CheckCircle2, Loader2, User, MapPin, Briefcase, Users, Phone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const languageOptions = ["Amharic", "Oromo", "Tigrinya", "English", "Arabic", "Somali", "Gurage", "Sidama"]

interface WorkerRegistrationProps {
  onComplete?: () => void
}

export default function WorkerRegistration({ onComplete }: WorkerRegistrationProps) {
  const { addUser } = useUsers()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [fydaVerified, setFydaVerified] = useState(false)
  const [verifyingFyda, setVerifyingFyda] = useState(false)

  const [formData, setFormData] = useState({
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

  const verifyFydaId = async () => {
    if (!formData.fydaId) {
      setError("Please enter FYDA ID")
      return
    }

    setVerifyingFyda(true)
    setError("")

    // Simulate FYDA ID verification
    setTimeout(() => {
      if (formData.fydaId.match(/^ET-[A-Z]{2}-\d{7}$/)) {
        setFydaVerified(true)
        setError("")
      } else {
        setError("Invalid FYDA ID format. Please use format: ET-AA-1234567")
        setFydaVerified(false)
      }
      setVerifyingFyda(false)
    }, 2000)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          fydaVerified &&
          formData.firstName &&
          formData.lastName &&
          formData.phone &&
          formData.email &&
          formData.dateOfBirth &&
          formData.gender
        )
      case 2:
        return !!(formData.region && formData.city)
      case 3:
        return !!(formData.skills.length > 0 && formData.experience && formData.languages.length > 0)
      case 4:
        return !!(formData.availability && formData.expectedWage)
      case 5:
        return !!(
          formData.emergencyContact.name &&
          formData.emergencyContact.phone &&
          formData.emergencyContact.relation
        )
      default:
        return true
    }
  }

  const handleNext = () => {
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

    setLoading(true)
    setError("")

    try {
      await addUser({
        ...formData,
        userType: "worker",
      })
      setSuccess(true)
      if (onComplete) {
        setTimeout(onComplete, 2000)
      }
    } catch (err) {
      setError("Failed to register worker. Please try again.")
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
            <h2 className="text-2xl font-bold text-green-700">Worker Registered Successfully!</h2>
            <p className="text-gray-600">
              {formData.firstName} {formData.lastName} has been added to the system and is pending verification.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>FYDA ID:</strong> {formData.fydaId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Skills:</strong> {formData.skills.join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {formData.city}, {formData.region}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stepIcons = [User, MapPin, Briefcase, Users, Phone]
  const stepTitles = ["Personal Info", "Location", "Skills", "Preferences", "Emergency Contact"]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Register New Worker
        </CardTitle>
        <CardDescription>
          Step {currentStep} of 5 - {stepTitles[currentStep - 1]}
        </CardDescription>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4">
          {stepTitles.map((title, index) => {
            const StepIcon = stepIcons[index]
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isValid = stepNumber === currentStep ? validateStep(stepNumber) : stepNumber < currentStep

            return (
              <div key={stepNumber} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? isValid
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-red-100 border-red-300 text-red-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-4 w-4" />}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
              </div>
            )
          })}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
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

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="fydaId">FYDA ID *</Label>
                  <Input
                    id="fydaId"
                    value={formData.fydaId}
                    onChange={(e) => handleInputChange("fydaId", e.target.value)}
                    placeholder="ET-AA-1234567"
                    disabled={fydaVerified}
                  />
                </div>
                <Button
                  onClick={verifyFydaId}
                  disabled={verifyingFyda || fydaVerified || !formData.fydaId}
                  variant={fydaVerified ? "default" : "outline"}
                  className="mt-6"
                >
                  {verifyingFyda ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : fydaVerified ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    "Verify FYDA ID"
                  )}
                </Button>
              </div>

              {fydaVerified && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>FYDA ID verified successfully!</AlertDescription>
                </Alert>
              )}

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

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}

        {/* Step 2: Location Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </h3>
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
              <div className="grid grid-cols-3 gap-4">
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
          </div>
        )}

        {/* Step 3: Skills and Experience */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Skills and Experience
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Skills * (Select all that apply)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
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
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
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
                <Label>Languages * (Select all that apply)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {languageOptions.map((language) => (
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
                {formData.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Work Preferences */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Work Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => handleInputChange("availability", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="weekends">Weekends only</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedWage">Expected Daily Wage (ETB) *</Label>
                  <Input
                    id="expectedWage"
                    value={formData.expectedWage}
                    onChange={(e) => handleInputChange("expectedWage", e.target.value)}
                    placeholder="e.g., 300"
                  />
                </div>
                <div>
                  <Label htmlFor="workRadius">Work Radius (km)</Label>
                  <Input
                    id="workRadius"
                    value={formData.workRadius}
                    onChange={(e) => handleInputChange("workRadius", e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              <div>
                <Label>Preferred Job Types (Optional)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Daily Labor", "Contract Work", "Long-term Employment", "Seasonal Work"].map((jobType) => (
                    <div key={jobType} className="flex items-center space-x-2">
                      <Checkbox
                        id={jobType}
                        checked={formData.preferredJobTypes.includes(jobType)}
                        onCheckedChange={(checked) =>
                          handleArrayChange("preferredJobTypes", jobType, checked as boolean)
                        }
                      />
                      <Label htmlFor={jobType} className="text-sm">
                        {jobType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Emergency Contact */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contact Information
            </h3>
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
                  placeholder="+251911234567"
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
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h4 className="font-semibold mb-2">Registration Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <strong>FYDA ID:</strong> {formData.fydaId}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Location:</strong> {formData.city}, {formData.region}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Skills:</strong> {formData.skills.slice(0, 3).join(", ")}
                    {formData.skills.length > 3 && ` +${formData.skills.length - 3} more`}
                  </p>
                  <p>
                    <strong>Experience:</strong> {formData.experience}
                  </p>
                  <p>
                    <strong>Expected Wage:</strong> {formData.expectedWage} ETB/day
                  </p>
                  <p>
                    <strong>Availability:</strong> {formData.availability}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || loading}>
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button onClick={handleNext} disabled={loading || (currentStep === 1 && !fydaVerified)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Worker...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
