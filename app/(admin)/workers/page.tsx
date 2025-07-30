"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Search, MapPin, Phone, Mail, Star, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { db, withFirebaseErrorHandling } from "@/lib/firebase"
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false)
        setError('Request timed out. Please refresh the page.')
        setWorkers([])
      }
    }, 10000)

    const loadWorkers = async () => {
      if (isMounted) {
        await fetchWorkers()
      }
    }

    loadWorkers()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchWorkers = async () => {
    try {
      console.log('Fetching workers...')
      const usersCollection = collection(db, "users")
      const workersQuery = query(usersCollection, where("userType", "==", "worker"))
      const snapshot = await getDocs(workersQuery)
      const workersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('Workers fetched:', workersList.length)
      setWorkers(workersList)
    } catch (err: any) {
      console.error('Error fetching workers:', err)
      setError(err.message || "Failed to fetch workers data")
      // Set empty array as fallback
      setWorkers([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (workerId: string, newStatus: string) => {
    setActionLoading(workerId)
    try {
      await withFirebaseErrorHandling(async () => {
        await updateDoc(doc(db, "users", workerId), { status: newStatus })
      })
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, status: newStatus } : worker
      ))
    } catch (err: any) {
      setError(err.message || "Failed to update status")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredWorkers = workers.filter(worker => {
    const searchLower = searchTerm.toLowerCase()
    return (
      worker.name?.toLowerCase().includes(searchLower) ||
      worker.email?.toLowerCase().includes(searchLower) ||
      worker.fin?.includes(searchTerm) ||
      worker.fan?.includes(searchTerm) ||
      worker.skills?.some((skill: string) => skill.toLowerCase().includes(searchLower))
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workers Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage registered workers and their profiles</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading workers...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workers Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage registered workers and their profiles</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchWorkers()
              }}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{workers.length}</span>
              <span className="text-gray-600">Total Workers</span>
            </div>
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
            placeholder="Search workers by name, email, FIN/FAN, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredWorkers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No workers found" : "No workers registered yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Workers will appear here once they register"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {worker.name}
                      {worker.isFaydaVerified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {worker.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {worker.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(worker.status)}
                    <Badge variant="outline">Worker</Badge>
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
                          <code className="bg-gray-100 px-2 py-1 rounded">{worker.fin}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">FAN:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">{worker.fan}</code>
                        </div>
                      </div>
                    </div>

                    {worker.skills && worker.skills.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {worker.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
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
                          <span>{worker.registrationDate || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fayda Verified:</span>
                          <span className={worker.isFaydaVerified ? "text-green-600" : "text-red-600"}>
                            {worker.isFaydaVerified ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {worker.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(worker.id, "verified")}
                            disabled={actionLoading === worker.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === worker.id ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(worker.id, "rejected")}
                            disabled={actionLoading === worker.id}
                          >
                            {actionLoading === worker.id ? "..." : "Reject"}
                          </Button>
                        </>
                      )}
                      {worker.status === "verified" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(worker.id, "suspended")}
                          disabled={actionLoading === worker.id}
                        >
                          {actionLoading === worker.id ? "..." : "Suspend"}
                        </Button>
                      )}
                      {worker.status === "suspended" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(worker.id, "verified")}
                          disabled={actionLoading === worker.id}
                        >
                          {actionLoading === worker.id ? "..." : "Reactivate"}
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