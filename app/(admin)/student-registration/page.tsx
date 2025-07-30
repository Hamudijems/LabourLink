"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"
import { verifyFaydaID } from "@/lib/fayda-api"
import { 
  GraduationCap, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Shield,
  Loader2
} from "lucide-react"

interface Student {
  id: string
  fin: string
  fan: string
  firstName: string
  lastName: string
  email: string
  phone: string
  institution: string
  program: string
  startDate: string
  expectedGraduation: string
  status: "active" | "graduated" | "dropped"
  faydaVerified: boolean
  registrationDate: string
}

export default function StudentRegistration() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verifyingFayda, setVerifyingFayda] = useState(false)
  const [faydaVerified, setFaydaVerified] = useState(false)

  const [formData, setFormData] = useState({
    fin: "",
    fan: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    program: "",
    startDate: "",
    expectedGraduation: ""
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]')
      setStudents(registeredStudents)
    } catch (err) {
      console.error("Error fetching students:", err)
    }
  }

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
        setSuccess("Fayda ID verified successfully")
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
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === "fin" || field === "fan") {
      setFaydaVerified(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!faydaVerified) {
      setError("Please verify Fayda ID first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const studentData = {
        ...formData,
        status: "active",
        faydaVerified: true,
        registrationDate: new Date().toISOString().split('T')[0]
      }

      // Store in localStorage
      const existingStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]')
      const newStudent = {
        ...studentData,
        id: Date.now().toString()
      }
      existingStudents.push(newStudent)
      localStorage.setItem('registeredStudents', JSON.stringify(existingStudents))
      
      setSuccess("Student registered successfully")
      setFormData({
        fin: "",
        fan: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institution: "",
        program: "",
        startDate: "",
        expectedGraduation: ""
      })
      setFaydaVerified(false)
      await fetchStudents()
    } catch (err) {
      setError("Failed to register student")
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      graduated: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      dropped: { variant: "destructive" as const, className: "bg-red-100 text-red-800" }
    }
    
    const config = variants[status as keyof typeof variants] || variants.active
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">{students.filter(s => s.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Graduated</p>
                <p className="text-2xl font-bold">{students.filter(s => s.status === "graduated").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Register New Student
            </CardTitle>
            <CardDescription>
              Register students starting college/university with Fayda ID verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fin">FIN *</Label>
                  <Input
                    id="fin"
                    value={formData.fin}
                    onChange={(e) => handleInputChange("fin", e.target.value)}
                    placeholder="6140798523917519"
                    disabled={faydaVerified}
                  />
                </div>
                <div>
                  <Label htmlFor="fan">FAN *</Label>
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
                  <span className="text-sm text-green-600">✓ Fayda ID verified</span>
                )}
              </div>

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
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  placeholder="e.g., Addis Ababa University"
                  required
                />
              </div>

              <div>
                <Label htmlFor="program">Program/Degree *</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => handleInputChange("program", e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expectedGraduation">Expected Graduation *</Label>
                  <Input
                    id="expectedGraduation"
                    type="date"
                    value={formData.expectedGraduation}
                    onChange={(e) => handleInputChange("expectedGraduation", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading || !faydaVerified} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Student"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Students</CardTitle>
            <CardDescription>All students registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No students registered yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-500">{student.program}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.institution}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>{student.startDate}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}