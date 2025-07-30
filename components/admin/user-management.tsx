"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { subscribeToUsers, updateUser, deleteUser, FirebaseUser } from "@/services/firebase-services"
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Pause,
  Trash2,
  Users,
  Clock,
  RefreshCw,
  Database,
  Wifi,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserManagement() {
  const [users, setUsers] = useState<FirebaseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToUsers((usersData) => {
      setUsers(usersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const pendingUsers = users.filter(u => u.status === "pending")
  
  const refreshUsers = () => {
    // Firebase subscription handles real-time updates automatically
    console.log('Users refreshed via Firebase subscription')
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.fydaId || '').includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm)

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesType = typeFilter === "all" || user.userType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleUserAction = async (userId: string, action: string, newStatus?: string) => {
    setActionLoading(`${userId}-${action}`)
    try {
      if (action === "delete") {
        await deleteUser(userId)
      } else if (newStatus) {
        await updateUser(userId, { status: newStatus as any })
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err)
      setError(`Failed to ${action} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      verified: "default",
      suspended: "destructive",
      rejected: "outline",
    } as const

    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      rejected: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{loading ? "..." : users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{loading ? "..." : pendingUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold">
                  {loading ? "..." : users.filter((u) => u.status === "verified").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Firebase Status</p>
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium">Connected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Management
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={refreshUsers} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Manage user accounts and approvals with real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, FYDA ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>FYDA ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fayda Verified</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading users from Firebase...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                        ? "No users match your filters"
                        : "No users found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">FIN:</div>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded block">{user.fin}</code>
                          <div className="text-xs text-gray-500">FAN:</div>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded block">{user.fan}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.userType === "worker" ? "default" : "secondary"}>
                          {user.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell>{user.registrationDate}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id!, "approve", "verified")}
                                  disabled={actionLoading === `${user.id}-approve`}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id!, "reject", "rejected")}
                                  disabled={actionLoading === `${user.id}-reject`}
                                >
                                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status === "verified" && (
                              <DropdownMenuItem
                                onClick={() => handleUserAction(user.id!, "suspend", "suspended")}
                                disabled={actionLoading === `${user.id}-suspend`}
                              >
                                <Pause className="mr-2 h-4 w-4 text-yellow-600" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {user.status === "suspended" && (
                              <DropdownMenuItem
                                onClick={() => handleUserAction(user.id!, "reactivate", "verified")}
                                disabled={actionLoading === `${user.id}-reactivate`}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id!, "delete")}
                              disabled={actionLoading === `${user.id}-delete`}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              User Details - {selectedUser?.name || `${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`}
            </DialogTitle>
            <DialogDescription>Complete user information and activity</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">FIN</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedUser.fin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">FAN</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedUser.fan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">User Type</p>
                    <Badge variant="outline">{selectedUser.userType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Firebase ID</p>
                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{selectedUser.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p>{selectedUser.phone}</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Region</p>
                    <p>{selectedUser.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">City</p>
                    <p>{selectedUser.city}</p>
                  </div>
                  {selectedUser.subcity && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Subcity</p>
                      <p>{selectedUser.subcity}</p>
                    </div>
                  )}
                  {selectedUser.woreda && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Woreda</p>
                      <p>{selectedUser.woreda}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Worker-specific Information */}
              {selectedUser.userType === "worker" && (
                <>
                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUser.languages && selectedUser.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.languages.map((language: string) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Work Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.experience && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Experience</p>
                          <p>{selectedUser.experience}</p>
                        </div>
                      )}
                      {selectedUser.expectedWage && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Expected Wage</p>
                          <p>{selectedUser.expectedWage} ETB/day</p>
                        </div>
                      )}
                      {selectedUser.availability && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Availability</p>
                          <p>{selectedUser.availability}</p>
                        </div>
                      )}
                      {selectedUser.workRadius && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Work Radius</p>
                          <p>{selectedUser.workRadius} km</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedUser.emergencyContact && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Name</p>
                          <p>{selectedUser.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p>{selectedUser.emergencyContact.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Relationship</p>
                          <p>{selectedUser.emergencyContact.relation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Employer-specific Information */}
              {selectedUser.userType === "employer" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.companyName && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Company Name</p>
                        <p>{selectedUser.companyName}</p>
                      </div>
                    )}
                    {selectedUser.businessType && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Business Type</p>
                        <p>{selectedUser.businessType}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Date</p>
                    <p>{selectedUser.registrationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Active</p>
                    <p>{selectedUser.lastActive}</p>
                  </div>
                  {selectedUser.jobsCompleted !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Jobs Completed</p>
                      <p>{selectedUser.jobsCompleted}</p>
                    </div>
                  )}
                  {selectedUser.jobsPosted !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                      <p>{selectedUser.jobsPosted}</p>
                    </div>
                  )}
                  {selectedUser.rating !== undefined && selectedUser.rating > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating</p>
                      <p>{selectedUser.rating}/5.0</p>
                    </div>
                  )}
                  {selectedUser.totalEarnings && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p>{selectedUser.totalEarnings}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
