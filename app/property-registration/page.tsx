"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { db, checkFirestoreConnection } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { verifyFaydaID } from "@/lib/fayda-api"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Car,
  Home,
  CreditCard,
  Banknote,
  Plus,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { FirebaseStatus } from "@/components/firebase-status"

interface Property {
  type: string
  description: string
  value: string
  location?: string
  documents?: string
}

export default function PropertyRegistration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [verifyingFayda, setVerifyingFayda] = useState(false)
  const [faydaVerified, setFaydaVerified] = useState(false)

  const [formData, setFormData] = useState({
    fin: "",
    fan: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: ""
    }
  })

  const [properties, setProperties] = useState<Property[]>([])
  const [currentProperty, setCurrentProperty] = useState<Property>({
    type: "",
    description: "",
    value: "",
    location: "",
    documents: ""
  })

  const verifyFayda = async () => {
    if (!formData.fin || !formData.fan) {
      setError("Please enter both FIN and FAN")
      return
    }

    setVerifyingFayda(true)
    setError(null)

    try {
      const result = await verifyFaydaID(formData.fin, formData.fan)
      if (result.verified) {
        setFaydaVerified(true)
      } else {
        setError(result.error || "Fayda verification failed")
      }
    } catch (err) {
      setError("Verification service error")
    } finally {
      setVerifyingFayda(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    if (field === "fin" || field === "fan") {
      setFaydaVerified(false)
    }
  }

  const addProperty = () => {
    if (!currentProperty.type || !currentProperty.description || !currentProperty.value) {
      setError("Please fill all required property fields (Type, Description, Value)")
      return
    }

    if (parseFloat(currentProperty.value) <= 0) {
      setError("Property value must be greater than 0")
      return
    }

    setProperties(prev => [...prev, { ...currentProperty }])
    setCurrentProperty({
      type: "",
      description: "",
      value: "",
      location: "",
      documents: ""
    })
    setError(null)
  }

  const removeProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index))
  }

  const testFirebaseConnection = async () => {
    try {
      console.log("Testing Firebase connection...")
      const connectionOk = await checkFirestoreConnection()
      if (!connectionOk) {
        throw new Error("Connection check failed")
      }
      const testDoc = await addDoc(collection(db, "test"), { test: true, timestamp: new Date() })
      console.log("Firebase connection test successful:", testDoc.id)
      alert("Firebase connection is working!")
    } catch (err) {
      console.error("Firebase connection test failed:", err)
      alert("Firebase connection failed: " + (err as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!faydaVerified) {
      setError("Please verify your Fayda ID first")
      return
    }

    if (properties.length === 0) {
      setError("Please add at least one property")
      return
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill all required personal information fields")
      return
    }

    if (!formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relation) {
      setError("Please fill all emergency contact fields")
      return
    }

    setLoading(true)
    setError(null)

    const maxRetries = 3
    let attempt = 0
    
    while (attempt < maxRetries) {
      try {
        attempt++
        console.log(`Attempting to write to Firebase (attempt ${attempt})...`)
        
        // Check connection first
        const connectionOk = await checkFirestoreConnection()
        if (!connectionOk && attempt === 1) {
          throw new Error("Firebase connection unavailable")
        }
        
        const propertyData = {
          fin: formData.fin,
          fan: formData.fan,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          properties: properties,
          faydaVerified: true,
          registrationDate: new Date().toISOString().split('T')[0],
          createdAt: Timestamp.now(),
          totalValue: properties.reduce((sum, prop) => sum + parseFloat(prop.value || "0"), 0)
        }

        console.log("Submitting property data:", propertyData)
        console.log("Firebase db instance:", db)
        console.log("Properties collection:", collection(db, "properties"))
        
        const docRef = await addDoc(collection(db, "properties"), propertyData)
        console.log("Property registered with ID:", docRef.id)
        setSuccess(true)
        break
      } catch (err) {
        console.error(`Registration error (attempt ${attempt}):`, err)
        
        if (attempt === maxRetries) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
          setError(`Failed to register properties after ${maxRetries} attempts. Error: ${errorMessage}`)
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }
    
    setLoading(false)
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "vehicle": return <Car className="h-4 w-4" />
      case "real-estate": return <Home className="h-4 w-4" />
      case "bank-account": return <CreditCard className="h-4 w-4" />
      case "cash": return <Banknote className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
              <p className="text-gray-600">
                Your properties have been registered and verified. Your assets are now protected and can be verified through our system.
              </p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Register More Properties
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/landing">Back to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Registration</h1>
          <p className="text-gray-600">Secure your assets with Fayda ID verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Register Your Properties
            </CardTitle>
            <CardDescription>
              Register your vehicles, real estate, bank accounts, and other valuable assets for legal protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FirebaseStatus />
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fayda ID Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fayda ID Verification</h3>
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
                        <CheckCircle className="mr-2 h-4 w-4" />
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

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                      required
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Property Registration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add Properties</h3>
                
                {/* Add Property Form */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type *</Label>
                        <Select
                          value={currentProperty.type}
                          onValueChange={(value) => setCurrentProperty(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vehicle">Vehicle (Car, Motorcycle, etc.)</SelectItem>
                            <SelectItem value="real-estate">Real Estate (House, Land, etc.)</SelectItem>
                            <SelectItem value="bank-account">Bank Account</SelectItem>
                            <SelectItem value="cash">Cash/Savings</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="business">Business/Company</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="propertyValue">Estimated Value (ETB) *</Label>
                        <Input
                          id="propertyValue"
                          type="number"
                          value={currentProperty.value}
                          onChange={(e) => setCurrentProperty(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="100000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="propertyDescription">Description *</Label>
                      <Textarea
                        id="propertyDescription"
                        value={currentProperty.description}
                        onChange={(e) => setCurrentProperty(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g., Toyota Corolla 2020, White, Plate: AA-123456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyLocation">Location/Address</Label>
                      <Input
                        id="propertyLocation"
                        value={currentProperty.location}
                        onChange={(e) => setCurrentProperty(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Where is this property located?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyDocuments">Supporting Documents</Label>
                      <Input
                        id="propertyDocuments"
                        value={currentProperty.documents}
                        onChange={(e) => setCurrentProperty(prev => ({ ...prev, documents: e.target.value }))}
                        placeholder="e.g., Registration number, Certificate number, etc."
                      />
                    </div>
                    <Button type="button" onClick={addProperty} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                  </CardContent>
                </Card>

                {/* Property List */}
                {properties.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Registered Properties ({properties.length})</h4>
                    {properties.map((property, index) => (
                      <Card key={index} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              {getPropertyIcon(property.type)}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{property.type.replace("-", " ")}</Badge>
                                  <span className="font-medium">{parseFloat(property.value).toLocaleString()} ETB</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{property.description}</p>
                                {property.location && (
                                  <p className="text-xs text-gray-500">Location: {property.location}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProperty(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Total Value: {properties.reduce((sum, prop) => sum + parseFloat(prop.value || "0"), 0).toLocaleString()} ETB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button 
                  type="button"
                  onClick={testFirebaseConnection}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Test Firebase Connection
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !faydaVerified || properties.length === 0} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Properties...
                    </>
                  ) : (
                    "Register Properties"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}