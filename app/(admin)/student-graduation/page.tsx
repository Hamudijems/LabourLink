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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { verifyFaydaID } from "@/lib/fayda-api"
import { subscribeToStudents, updateStudent, FirebaseStudent } from "@/services/student-services"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { 
  GraduationCap, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Shield,
  Loader2,
  Search,
  Eye
} from "lucide-react"

interface Graduate {
  id: string
  fin: string
  fan: string
  firstName: string
  lastName: string
  email: string
  phone: string
  institution: string
  program: string
  graduationDate: string
  gpa?: string
  honors?: string
  faydaVerified: boolean
  registrationDate: string
}

export default function StudentGraduation() {
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [students, setStudents] = useState<FirebaseStudent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verifyingFayda, setVerifyingFayda] = useState(false)
  const [faydaVerified, setFaydaVerified] = useState(false)
  const [selectedGraduate, setSelectedGraduate] = useState<Graduate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    fin: "",
    fan: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    program: "",
    graduationDate: "",
    gpa: "",
    honors: ""
  })

  useEffect(() => {
    // Subscribe to students
    const unsubscribeStudents = subscribeToStudents((studentsData) => {
      setStudents(studentsData.filter(s => s.status === "active"))
    })

    // Subscribe to graduates
    fetchGraduates()

    return () => unsubscribeStudents()
  }, [])

  const fetchGraduates = async () => {
    try {
      if (db) {
        const { getDocs } = await import('firebase/firestore')
        const snapshot = await getDocs(collection(db, 'graduates'))
        const graduatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Graduate[]
        setGraduates(graduatesData)
      }
    } catch (err) {
      console.error("Error fetching graduates:", err)
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

  const graduateStudent = async (studentId: string) => {
    try {
      await updateStudent(studentId, { status: "graduated" })
      setSuccess("Student marked as graduated")
    } catch (err) {
      setError("Failed to update student status")
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
      // Check if student exists in Firebase
      const existingStudent = students.find(student => 
        student.fin === formData.fin && student.fan === formData.fan
      )

      if (!existingStudent) {
        setError("Student not found in registration system. Please register the student first before graduation.")
        setLoading(false)
        return
      }

      if (existingStudent.status === "graduated") {
        setError("This student has already graduated.")
        setLoading(false)
        return
      }

      const graduateData = {
        ...formData,
        faydaVerified: true,
        registrationDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }

      // Store graduate in Firebase
      if (db) {
        await addDoc(collection(db, 'graduates'), graduateData)
      }
      
      // Update student status to graduated
      if (existingStudent.id) {
        await updateStudent(existingStudent.id, { status: "graduated" })
      }
      
      setSuccess(`Graduate registered successfully! Student ${existingStudent.firstName} ${existingStudent.lastName} has been marked as graduated.`)
      setFormData({
        fin: "",
        fan: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institution: "",
        program: "",
        graduationDate: "",
        gpa: "",
        honors: ""
      })
      setFaydaVerified(false)
      await fetchGraduates()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to register graduate: ${errorMessage}`)
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredGraduates = graduates.filter(graduate =>
    `${graduate.firstName} ${graduate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    graduate.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    graduate.program.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Graduates</p>
                <p className="text-2xl font-bold">{graduates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Graduates</p>
                <p className="text-2xl font-bold">{graduates.filter(g => g.faydaVerified).length}</p>
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
              Register Graduate
            </CardTitle>
            <CardDescription>
              Register students who have graduated with Fayda ID verification
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
                  required
                />
              </div>

              <div>
                <Label htmlFor="program">Program/Degree *</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => handleInputChange("program", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="graduationDate">Graduation Date *</Label>
                  <Input
                    id="graduationDate"
                    type="date"
                    value={formData.graduationDate}
                    onChange={(e) => handleInputChange("graduationDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    placeholder="3.75"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="honors">Honors/Awards</Label>
                <Input
                  id="honors"
                  value={formData.honors}
                  onChange={(e) => handleInputChange("honors", e.target.value)}
                  placeholder="Magna Cum Laude, Dean's List, etc."
                />
              </div>

              <Button type="submit" disabled={loading || !faydaVerified} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Graduate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Graduates</CardTitle>
            <CardDescription>All graduates registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search graduates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Graduate</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Graduation Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGraduates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No graduates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGraduates.map((graduate) => (
                      <TableRow key={graduate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{graduate.firstName} {graduate.lastName}</p>
                            <p className="text-sm text-gray-500">{graduate.program}</p>
                          </div>
                        </TableCell>
                        <TableCell>{graduate.institution}</TableCell>
                        <TableCell>{graduate.graduationDate}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGraduate(graduate)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      <Dialog open={!!selectedGraduate} onOpenChange={() => setSelectedGraduate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Graduate Details - {selectedGraduate?.firstName} {selectedGraduate?.lastName}
            </DialogTitle>
            <DialogDescription>Complete graduate information</DialogDescription>
          </DialogHeader>
          {selectedGraduate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">FIN</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedGraduate.fin}</code>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">FAN</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedGraduate.fan}</code>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Institution</p>
                  <p>{selectedGraduate.institution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Program</p>
                  <p>{selectedGraduate.program}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Graduation Date</p>
                  <p>{selectedGraduate.graduationDate}</p>
                </div>
                {selectedGraduate.gpa && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">GPA</p>
                    <p>{selectedGraduate.gpa}</p>
                  </div>
                )}
                {selectedGraduate.honors && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600">Honors/Awards</p>
                    <p>{selectedGraduate.honors}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}