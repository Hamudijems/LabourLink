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
import { verifyFaydaID } from "@/lib/fayda-api"
import { addK12Student, subscribeToK12Students, FirebaseK12Student } from "@/services/student-services"
import { 
  BookOpen, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  Loader2,
  Search
} from "lucide-react"



export default function K12Registration() {
  const [students, setStudents] = useState<FirebaseK12Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verifyingFayda, setVerifyingFayda] = useState(false)
  const [faydaVerified, setFaydaVerified] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    parentFin: "",
    parentFan: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: ""
  })

  useEffect(() => {
    const unsubscribe = subscribeToK12Students((studentsData) => {
      setStudents(studentsData)
    })

    return () => unsubscribe()
  }, [])

  const verifyFayda = async () => {
    if (!formData.parentFin || !formData.parentFan) {
      setError("Please enter both parent FIN and FAN")
      return
    }

    setVerifyingFayda(true)
    setError(null)

    try {
      const result = await verifyFaydaID(formData.parentFin, formData.parentFan)
      if (result.verified) {
        setFaydaVerified(true)
        setSuccess("Parent Fayda ID verified successfully")
      } else {
        setError(result.error || "Parent Fayda verification failed")
      }
    } catch (err) {
      setError("Verification service error")
    } finally {
      setVerifyingFayda(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === "parentFin" || field === "parentFan") {
      setFaydaVerified(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!faydaVerified) {
      setError("Please verify parent Fayda ID first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const studentData = {
        ...formData,
        status: "enrolled" as const,
        faydaVerified: true,
        registrationDate: new Date().toISOString().split('T')[0]
      }

      await addK12Student(studentData)
      
      setSuccess("K-12 student registered successfully")
      setFormData({
        parentFin: "",
        parentFan: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        grade: "",
        school: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: ""
      })
      setFaydaVerified(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to register K-12 student: ${errorMessage}`)
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.includes(searchTerm)
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      enrolled: { variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      graduated: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      transferred: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" }
    }
    
    const config = variants[status as keyof typeof variants] || variants.enrolled
    
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
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total K-12 Students</p>
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
                <p className="text-sm font-medium text-gray-600">Enrolled Students</p>
                <p className="text-2xl font-bold">{students.filter(s => s.status === "enrolled").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
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
              Register K-12 Student
            </CardTitle>
            <CardDescription>
              Register students for grades 1-12 with parent Fayda ID verification
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
                  <Label htmlFor="parentFin">Parent FIN *</Label>
                  <Input
                    id="parentFin"
                    value={formData.parentFin}
                    onChange={(e) => handleInputChange("parentFin", e.target.value)}
                    placeholder="6140798523917519"
                    disabled={faydaVerified}
                  />
                </div>
                <div>
                  <Label htmlFor="parentFan">Parent FAN *</Label>
                  <Input
                    id="parentFan"
                    value={formData.parentFan}
                    onChange={(e) => handleInputChange("parentFan", e.target.value)}
                    placeholder="3126894653473958"
                    disabled={faydaVerified}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={verifyFayda}
                  disabled={verifyingFayda || faydaVerified || !formData.parentFin || !formData.parentFan}
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
                      Verify Parent ID
                    </>
                  )}
                </Button>
                {faydaVerified && (
                  <span className="text-sm text-green-600">✓ Parent ID verified</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Student First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Student Last Name *</Label>
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
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade *</Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Grade 1</SelectItem>
                      <SelectItem value="2">Grade 2</SelectItem>
                      <SelectItem value="3">Grade 3</SelectItem>
                      <SelectItem value="4">Grade 4</SelectItem>
                      <SelectItem value="5">Grade 5</SelectItem>
                      <SelectItem value="6">Grade 6</SelectItem>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="school">School Name *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  placeholder="e.g., Addis Ababa Elementary School"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Parent Phone *</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="parentEmail">Parent Email *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Home Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Full home address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
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
                  "Register K-12 Student"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered K-12 Students</CardTitle>
            <CardDescription>All K-12 students registered in the system</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, school, grade, or parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Parent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {students.length === 0 ? "No K-12 students registered yet" : "No students match your search"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-500">DOB: {student.dateOfBirth}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.school}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Grade {student.grade}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{student.parentName}</p>
                            <p className="text-sm text-gray-500">{student.parentPhone}</p>
                          </div>
                        </TableCell>
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