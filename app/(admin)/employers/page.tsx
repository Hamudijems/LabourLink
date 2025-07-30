"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Search, MapPin, Phone, Mail, Building, CheckCircle, AlertTriangle } from "lucide-react"
import { db, withFirebaseErrorHandling } from "@/lib/firebase"
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"

export default function EmployersPage() {
  const [employers, setEmployers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      await withFirebaseErrorHandling(async () => {
        const usersCollection = collection(db, "users")
        const employersQuery = query(usersCollection, where("userType", "==", "employer"))
        const snapshot = await getDocs(employersQuery)
        const employersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setEmployers(employersList)
      })
    } catch (err: any) {
      setError(err.message || "Failed to fetch employers data")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (employerId: string, newStatus: string) => {
    setActionLoading(employerId)
    try {
      await withFirebaseErrorHandling(async () => {
        await updateDoc(doc(db, "users", employerId), { status: newStatus })
      })
      setEmployers(prev => prev.map(employer => 
        employer.id === employerId ? { ...employer, status: newStatus } : employer
      ))
    } catch (err: any) {
      setError(err.message || "Failed to update status")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredEmployers = employers.filter(employer => {
    const searchLower = searchTerm.toLowerCase()
    return (
      employer.name?.toLowerCase().includes(searchLower) ||
      employer.email?.toLowerCase().includes(searchLower) ||
      employer.fin?.includes(searchTerm) ||
      employer.fan?.includes(searchTerm) ||
      employer.companyName?.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800", 
      suspended: "bg-red-100 text-red-800",
      rejected: "bg-gray-100 text-gray-800"
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading employers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employers Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage registered employers and their companies</p>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span className="text-2xl font-bold">{employers.length}</span>
            <span className="text-gray-600">Total Employers</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employers by name, email, FIN/FAN, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEmployers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No employers found" : "No employers registered yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Employers will appear here once they register"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEmployers.map((employer) => (
            <Card key={employer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {employer.name}
                      {employer.isFaydaVerified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                    {employer.companyName && (
                      <div className="flex items-center gap-1 mt-1 text-blue-600">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{employer.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {employer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {employer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(employer.status)}
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Employer</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Fayda ID Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">FIN:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">{employer.fin}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">FAN:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">{employer.fan}</code>
                        </div>
                      </div>
                    </div>

                    {employer.businessType && (
                      <div>
                        <h4 className="font-semibold mb-2">Business Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Type:</span>
                            <Badge variant="secondary">{employer.businessType}</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Registration Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registered:</span>
                          <span>{employer.registrationDate || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fayda Verified:</span>
                          <span className={employer.isFaydaVerified ? "text-green-600" : "text-red-600"}>
                            {employer.isFaydaVerified ? "Yes" : "No"}
                          </span>
                        </div>
                        {employer.jobsPosted !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jobs Posted:</span>
                            <span>{employer.jobsPosted || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {employer.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(employer.id, "verified")}
                            disabled={actionLoading === employer.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === employer.id ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(employer.id, "rejected")}
                            disabled={actionLoading === employer.id}
                          >
                            {actionLoading === employer.id ? "..." : "Reject"}
                          </Button>
                        </>
                      )}
                      {employer.status === "verified" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(employer.id, "suspended")}
                          disabled={actionLoading === employer.id}
                        >
                          {actionLoading === employer.id ? "..." : "Suspend"}
                        </Button>
                      )}
                      {employer.status === "suspended" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(employer.id, "verified")}
                          disabled={actionLoading === employer.id}
                        >
                          {actionLoading === employer.id ? "..." : "Reactivate"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}