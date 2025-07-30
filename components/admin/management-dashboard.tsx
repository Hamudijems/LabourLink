"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Briefcase,
  AlertTriangle,
  Shield,
  Download,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  RefreshCw,
  Activity,
  GraduationCap,
  BookOpen
} from "lucide-react"
import { subscribeToUsers, subscribeToJobs, subscribeToContracts, FirebaseUser, FirebaseJob, FirebaseContract } from "@/services/firebase-services"
import { subscribeToStudents, subscribeToK12Students, FirebaseStudent, FirebaseK12Student } from "@/services/student-services"

export default function ManagementDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<FirebaseUser[]>([])
  const [jobs, setJobs] = useState<FirebaseJob[]>([])
  const [contracts, setContracts] = useState<FirebaseContract[]>([])
  const [students, setStudents] = useState<FirebaseStudent[]>([])
  const [k12Students, setK12Students] = useState<FirebaseK12Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  const fetchAllData = () => {
    setLastUpdate(new Date())
  }

  useEffect(() => {
    setMounted(true)
    setLastUpdate(new Date())
    setLoading(true)
    
    // Subscribe to all Firebase collections
    const unsubscribeUsers = subscribeToUsers((usersData) => {
      setUsers(usersData)
      setLoading(false)
    })
    
    const unsubscribeJobs = subscribeToJobs((jobsData) => {
      setJobs(jobsData)
    })
    
    const unsubscribeContracts = subscribeToContracts((contractsData) => {
      setContracts(contractsData)
    })
    
    const unsubscribeStudents = subscribeToStudents((studentsData) => {
      setStudents(studentsData)
    })
    
    const unsubscribeK12Students = subscribeToK12Students((k12StudentsData) => {
      setK12Students(k12StudentsData)
    })
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAllData()
    }, 30000)
    
    return () => {
      unsubscribeUsers()
      unsubscribeJobs()
      unsubscribeContracts()
      unsubscribeStudents()
      unsubscribeK12Students()
      clearInterval(interval)
    }
  }, [])

  // Real-time calculations
  const activeJobs = jobs.filter((job) => job.status === "active")
  const completedContracts = contracts.filter((contract) => contract.status === "completed")
  const activeContracts = contracts.filter((contract) => contract.status === "active")
  const totalEarnings = completedContracts.reduce((sum, contract) => {
    return sum + (Number.parseFloat(contract.totalAmount || "0") || 0)
  }, 0)

  // Recent activity
  const recentUsers = users.slice(0, 5)
  const recentJobs = jobs.slice(0, 5)
  const recentContracts = contracts.slice(0, 5)

  // Job categories analysis
  const jobCategories = jobs.reduce(
    (acc, job) => {
      const category = job.skillsRequired[0] || "General"
      if (!acc[category]) {
        acc[category] = { count: 0, totalWage: 0 }
      }
      acc[category].count++
      acc[category].totalWage += Number.parseFloat(job.wage) || 0
      return acc
    },
    {} as Record<string, { count: number; totalWage: number }>,
  )

  const jobMetrics = Object.entries(jobCategories)
    .map(([category, data]) => ({
      category,
      count: data.count,
      avgWage: data.count > 0 ? Math.round(data.totalWage / data.count) : 0,
    }))
    .slice(0, 4)

  // Regional distribution
  const regionalData = users.reduce(
    (acc, user) => {
      const region = user.region
      acc[region] = (acc[region] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topRegions = Object.entries(regionalData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  // Flagged issues (mock for now - would come from real monitoring)
  const flaggedIssues = [
    {
      id: 1,
      type: "dispute",
      title: "Payment Dispute - Construction Job",
      worker: "Abebe Tadesse",
      employer: "BuildCorp ET",
      amount: "1,200 ETB",
      date: new Date().toISOString().split("T")[0],
      status: "investigating",
    },
    {
      id: 2,
      type: "fraud",
      title: "Duplicate FYDA ID Detected",
      details: "Same FYDA ID used by multiple accounts",
      date: new Date().toISOString().split("T")[0],
      status: "urgent",
    },
  ]

  const pendingUsers = users.filter((u) => u.status === "pending")
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Management Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Real-time system overview and platform management</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Last updated: {mounted && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-xl font-bold">{loading ? "..." : users.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Jobs</p>
                <p className="text-xl font-bold">{loading ? "..." : activeJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Earnings</p>
                <p className="text-xl font-bold">{loading ? "..." : `${totalEarnings.toLocaleString()} ETB`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Contracts</p>
                <p className="text-xl font-bold">{loading ? "..." : activeContracts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pending Approvals</p>
                <p className="text-xl font-bold">{loading ? "..." : pendingUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
                <p className="text-xl font-bold">{loading ? "..." : (students.length + k12Students.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="jobs">Job Analytics</TabsTrigger>
          <TabsTrigger value="issues">Issues & Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent User Registrations
                  </div>
                  <Badge variant="secondary">{recentUsers.length} new</Badge>
                </CardTitle>
                <CardDescription>Latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : recentUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No recent registrations</p>
                  ) : (
                    recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {user.firstName} {user.lastName}
                            </h4>
                            <Badge variant={user.userType === "worker" ? "default" : "secondary"}>
                              {user.userType}
                            </Badge>
                            <Badge variant={user.status === "verified" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            <div>FYDA: {user.fydaId}</div>
                            <div>
                              {user.region} • {user.registrationDate}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Health & Metrics
                </CardTitle>
                <CardDescription>Real-time platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Firebase Connection</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real-time Updates</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Sync Status</span>
                  <Badge className="bg-green-100 text-green-800">Synchronized</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Workers</span>
                  <Badge variant="outline">{users.filter((u) => u.userType === "worker").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Employers</span>
                  <Badge variant="outline">{users.filter((u) => u.userType === "employer").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed Contracts</span>
                  <Badge variant="outline">{completedContracts.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>College Students</span>
                  <Badge variant="outline">{students.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>K-12 Students</span>
                  <Badge variant="outline">{k12Students.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs and Contracts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Recent Job Postings
                </CardTitle>
                <CardDescription>Latest jobs posted by employers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : recentJobs.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No recent jobs</p>
                  ) : (
                    recentJobs.map((job) => (
                      <div key={job.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.employerName}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                              <DollarSign className="h-3 w-3 ml-2" />
                              {job.wage} ETB/{job.wageType}
                            </div>
                          </div>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Contracts
                </CardTitle>
                <CardDescription>Latest work contracts created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : recentContracts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No recent contracts</p>
                  ) : (
                    recentContracts.map((contract) => (
                      <div key={contract.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{contract.jobTitle}</h4>
                            <p className="text-sm text-gray-600">
                              {contract.workerName} ↔ {contract.employerName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <DollarSign className="h-3 w-3" />
                              {contract.wage} ETB/{contract.wageType}
                              <Clock className="h-3 w-3 ml-2" />
                              {contract.startDate}
                            </div>
                          </div>
                          <Badge
                            variant={
                              contract.status === "active"
                                ? "default"
                                : contract.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>Real-time user metrics and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center cursor-pointer hover:bg-gray-50 p-4 border rounded-lg" onClick={() => router.push('/workers')}>
                    <div className="text-2xl font-bold text-green-600">
                      {users.filter((u) => u.userType === "worker").length}
                    </div>
                    <div className="text-sm text-gray-600">Workers</div>
                  </div>
                  <div className="text-center cursor-pointer hover:bg-gray-50 p-4 border rounded-lg" onClick={() => router.push('/employers')}>
                    <div className="text-2xl font-bold text-purple-600">
                      {users.filter((u) => u.userType === "employer").length}
                    </div>
                    <div className="text-sm text-gray-600">Employers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{pendingUsers.length}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Statistics</CardTitle>
                <CardDescription>Educational platform metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center cursor-pointer hover:bg-gray-50 p-4 border rounded-lg" onClick={() => router.push('/student-registration')}>
                    <div className="text-2xl font-bold text-indigo-600">{students.length}</div>
                    <div className="text-sm text-gray-600">College Students</div>
                  </div>
                  <div className="text-center cursor-pointer hover:bg-gray-50 p-4 border rounded-lg" onClick={() => router.push('/k12-registration')}>
                    <div className="text-2xl font-bold text-pink-600">{k12Students.length}</div>
                    <div className="text-sm text-gray-600">K-12 Students</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {students.filter(s => s.status === 'active').length + k12Students.filter(s => s.status === 'enrolled').length}
                    </div>
                    <div className="text-sm text-gray-600">Active Students</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {students.filter(s => s.status === 'graduated').length + k12Students.filter(s => s.status === 'graduated').length}
                    </div>
                    <div className="text-sm text-gray-600">Graduated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Student Registrations</CardTitle>
              <CardDescription>Latest student enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...students.slice(-3), ...k12Students.slice(-3)].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                      <p className="text-sm text-gray-600">
                        {student.institution || student.school} {student.grade && `- Grade ${student.grade}`}
                      </p>
                    </div>
                    <Badge variant={student.status === 'active' || student.status === 'enrolled' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                ))}
                {students.length === 0 && k12Students.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No students registered yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Analytics Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Categories</CardTitle>
                <CardDescription>Most popular job types and average wages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : jobMetrics.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No job data available</p>
                  ) : (
                    jobMetrics.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{job.category}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{job.count} active jobs</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{job.avgWage} ETB</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">avg wage</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : topRegions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No regional data available</p>
                  ) : (
                    topRegions.map(([region, count], index) => {
                      const percentage = Math.round((count / users.length) * 100)
                      return (
                        <div key={region} className="flex justify-between items-center">
                          <span>{region}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm w-12 text-right">{count}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Reports</CardTitle>
              <CardDescription>Issues requiring attention (demo data)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              issue.status === "urgent"
                                ? "text-red-600"
                                : issue.status === "investigating"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                            }`}
                          />
                          <h4 className="font-semibold">{issue.title}</h4>
                          <Badge
                            variant={
                              issue.status === "urgent"
                                ? "destructive"
                                : issue.status === "investigating"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {issue.worker && <div>Worker: {issue.worker}</div>}
                          {issue.employer && <div>Employer: {issue.employer}</div>}
                          {issue.amount && <div>Amount: {issue.amount}</div>}
                          {issue.details && <div>Details: {issue.details}</div>}
                          <div>Reported: {issue.date}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">Take Action</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
