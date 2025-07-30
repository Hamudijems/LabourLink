"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QrCode, Users, Briefcase, Eye, Plus, Search, MapPin, Clock, DollarSign } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, where, query } from "firebase/firestore"
import { useAuth } from "../auth/auth-context"

// Mock employer ID for demo - in real app this would come from auth
const MOCK_EMPLOYER_ID = "employer-123"

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showQRScanner, setShowQRScanner] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      try {
        const jobsCollection = collection(db, "jobs")
        const q = query(jobsCollection, where("employerId", "==", user.uid))
        const jobSnapshot = await getDocs(q)
        const jobList = jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setJobs(jobList)

        const applicationsCollection = collection(db, "applications")
        const appQ = query(applicationsCollection, where("employerId", "==", user.uid))
        const appSnapshot = await getDocs(appQ)
        const appList = appSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setApplications(appList)

        const contractsCollection = collection(db, "contracts")
        const conQ = query(contractsCollection, where("employerId", "==", user.uid))
        const conSnapshot = await getDocs(conQ)
        const conList = conSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setContracts(conList)

        const usersCollection = collection(db, "users")
        const userSnapshot = await getDocs(usersCollection)
        const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUsers(userList)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Get current employer data
  const currentEmployer = users.find((u) => u.id === MOCK_EMPLOYER_ID) || users.find((u) => u.userType === "employer")

  // Filter data for current employer
  const employerJobs = jobs.filter((j) => j.employerId === MOCK_EMPLOYER_ID)
  const employerContracts = contracts.filter((c) => c.employerId === MOCK_EMPLOYER_ID)

  // Get applications for employer's jobs
  const employerApplications = applications.filter((app) => employerJobs.some((job) => job.id === app.jobId))

  // Active jobs
  const activeJobs = employerJobs.filter((job) => job.status === "active")

  // Recent applicants
  const recentApplicants = employerApplications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5)
    .map((app) => {
      const worker = users.find((u) => u.id === app.workerId)
      return {
        ...app,
        worker,
        verified: true, // All users are FYDA verified
        rating: worker?.rating || 4.5,
        experience: worker?.experience || "intermediate",
        location: worker ? `${worker.city}, ${worker.region}` : "Unknown",
      }
    })

  // Calculate stats
  const totalJobsPosted = employerJobs.length
  const totalApplicants = employerApplications.length
  const totalJobViews = employerJobs.reduce((sum, job) => sum + job.applicants * 3, 0) // Estimate views
  const activeContracts = employerContracts.filter((c) => c.status === "active").length

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your job postings and find qualified workers</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button onClick={() => setShowQRScanner(true)} variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Scan Worker QR
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Jobs</p>
                <p className="text-xl font-bold">{activeJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Applicants</p>
                <p className="text-xl font-bold">{totalApplicants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Job Views</p>
                <p className="text-xl font-bold">{totalJobViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Contracts</p>
                <p className="text-xl font-bold">{activeContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Active Job Postings
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Job
                </Button>
              </CardTitle>
              <CardDescription>Manage your current job listings and applications (real-time)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active job postings.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              ) : (
                activeJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.wage} ETB/{job.wageType}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.duration}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants} applicants
                      </div>
                      <div className="text-gray-500 text-xs">Posted {job.createdAt}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skillsRequired.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Applicants ({job.applicants})
                      </Button>
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Pause</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Applicants & QR Scanner */}
        <div className="space-y-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Worker QR Scanner
              </CardTitle>
              <CardDescription>Scan a worker's QR code to view their verified profile</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {showQRScanner ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
                    <div className="w-32 h-32 bg-white dark:bg-gray-600 mx-auto rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">Point camera at worker's QR code</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowQRScanner(false)}>
                    Close Scanner
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowQRScanner(true)} className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Open QR Scanner
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Applicants */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
              <CardDescription>Latest applications to your jobs (real-time)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search applicants..." className="pl-10" />
                </div>

                {recentApplicants.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent applications</p>
                ) : (
                  recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{applicant.workerName}</h4>
                            {applicant.verified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                FYDA Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{applicant.jobTitle}</p>
                        </div>
                        <span className="text-xs text-gray-500">{applicant.appliedAt}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div>Rating: {applicant.rating}/5</div>
                        <div>{applicant.experience} exp</div>
                        <div className="col-span-2">{applicant.location}</div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          Message
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Job Performance</CardTitle>
              <CardDescription>Your posting statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Jobs Posted</span>
                  <span className="font-semibold">{totalJobsPosted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Postings</span>
                  <span className="font-semibold">{activeJobs.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Applications</span>
                  <span className="font-semibold">{totalApplicants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Contracts</span>
                  <span className="font-semibold">{activeContracts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Rate</span>
                  <span className="font-semibold">
                    {totalJobsPosted > 0 ? Math.round((totalApplicants / totalJobsPosted) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
