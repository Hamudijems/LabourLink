"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, MapPin, Clock, DollarSign, Star, Eye, CheckCircle } from "lucide-react"
import { Layout } from "../layout"
import { useAppData } from "../context/app-data-context"
import { useUsers } from "../context/user-context"

// Mock worker ID for demo - in real app this would come from auth
const MOCK_WORKER_ID = "worker-123"

export default function WorkerDashboard() {
  const { jobs, contracts, applications, addApplication } = useAppData()
  const { users } = useUsers()
  const [showQR, setShowQR] = useState(false)
  const [applyingToJob, setApplyingToJob] = useState<string | null>(null)

  // Get current worker data
  const currentWorker = users.find((u) => u.id === MOCK_WORKER_ID) || users.find((u) => u.userType === "worker")

  // Filter data for current worker
  const workerContracts = contracts.filter((c) => c.workerId === MOCK_WORKER_ID)
  const workerApplications = applications.filter((a) => a.workerId === MOCK_WORKER_ID)
  const appliedJobIds = new Set(workerApplications.map((a) => a.jobId))

  // Get job matches based on worker skills
  const jobMatches = jobs
    .filter((job) => job.status === "active")
    .filter((job) => !appliedJobIds.has(job.id!))
    .map((job) => {
      // Calculate match percentage based on skills
      const workerSkills = currentWorker?.skills || []
      const jobSkills = job.skillsRequired
      const matchingSkills = jobSkills.filter((skill) =>
        workerSkills.some(
          (workerSkill) =>
            workerSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(workerSkill.toLowerCase()),
        ),
      )
      const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 50

      return {
        ...job,
        match: Math.max(matchPercentage, 30), // Minimum 30% match for display
      }
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 5)

  // Recent completed contracts
  const recentContracts = workerContracts
    .filter((c) => c.status === "completed")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  // Calculate stats
  const completedJobs = workerContracts.filter((c) => c.status === "completed").length
  const totalEarnings = workerContracts
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + (Number.parseFloat(c.totalAmount || "0") || 0), 0)
  const averageRating = currentWorker?.rating || 4.8
  const profileViews = 28 // Mock data

  const handleApplyToJob = async (job: any) => {
    if (!currentWorker) return

    setApplyingToJob(job.id)
    try {
      await addApplication({
        jobId: job.id!,
        workerId: MOCK_WORKER_ID,
        employerId: job.employerId,
        workerName: `${currentWorker.firstName} ${currentWorker.lastName}`,
        jobTitle: job.title,
        status: "pending",
        message: `I am interested in this ${job.title} position. I have experience in ${currentWorker.skills?.slice(0, 2).join(", ")}.`,
      })
    } catch (error) {
      console.error("Error applying to job:", error)
    } finally {
      setApplyingToJob(null)
    }
  }

  return (
    <Layout userType="worker">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {currentWorker?.firstName || "Worker"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Here are your latest job matches and earnings summary</p>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Earnings</p>
                  <p className="text-xl font-bold">{totalEarnings.toLocaleString()} ETB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Jobs Done</p>
                  <p className="text-xl font-bold">{completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rating</p>
                  <p className="text-xl font-bold">{averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Profile Views</p>
                  <p className="text-xl font-bold">{profileViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Real-time Job Matches */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Job Matches for You
                  <Badge variant="secondary">{jobMatches.length} available</Badge>
                </CardTitle>
                <CardDescription>Jobs matched based on your skills and location (real-time)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job matches available at the moment.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back later for new opportunities!</p>
                  </div>
                ) : (
                  jobMatches.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{job.employerName}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {job.match}% match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.wage} ETB/{job.wageType}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.duration}
                        </div>
                        <div className="text-gray-500 text-xs">{job.applicants} applicants</div>
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
                        <Button
                          className="flex-1"
                          onClick={() => handleApplyToJob(job)}
                          disabled={applyingToJob === job.id}
                        >
                          {applyingToJob === job.id ? "Applying..." : "Apply Now"}
                        </Button>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile & QR Code */}
          <div className="space-y-6">
            {/* QR Code Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Your QR Profile
                </CardTitle>
                <CardDescription>Employers can scan this to view your verified profile</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {showQR ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Show this QR code to employers</p>
                    <Button variant="outline" onClick={() => setShowQR(false)}>
                      Hide QR Code
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setShowQR(true)} className="w-full">
                    Show QR Code
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Work */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Work</CardTitle>
                <CardDescription>Your completed contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentContracts.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No completed work yet</p>
                ) : (
                  recentContracts.map((contract) => (
                    <div key={contract.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{contract.jobTitle}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{contract.employerName}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          {contract.startDate} - {contract.endDate || "Ongoing"}
                        </span>
                        <span className="font-semibold">{contract.totalAmount || contract.wage} ETB</span>
                      </div>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength</CardTitle>
                <CardDescription>Complete your profile to get more matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <Button variant="outline" className="w-full bg-transparent">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workerApplications.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No applications yet</p>
                  ) : (
                    workerApplications.slice(0, 3).map((application) => (
                      <div key={application.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{application.jobTitle}</h4>
                            <p className="text-xs text-gray-600">Applied {application.appliedAt}</p>
                          </div>
                          <Badge
                            variant={
                              application.status === "accepted"
                                ? "default"
                                : application.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                  {workerApplications.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View All Applications ({workerApplications.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
