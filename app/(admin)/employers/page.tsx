"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Phone, Mail, Building, CheckCircle, Search } from "lucide-react"
import { subscribeToUsers, updateUser, FirebaseUser } from "@/services/firebase-services"

export default function EmployersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employers, setEmployers] = useState<FirebaseUser[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToUsers((users) => {
      const employerUsers = users.filter(user => user.userType === 'employer')
      setEmployers(employerUsers)
    })

    return () => unsubscribe()
  }, [])

  const filteredEmployers = employers.filter(employer => {
    const fullName = `${employer.firstName} ${employer.lastName}`.toLowerCase()
    const companyName = employer.companyName ? employer.companyName.toLowerCase() : ''
    const businessType = employer.businessType ? employer.businessType.toLowerCase() : ''
    return fullName.includes(searchTerm.toLowerCase()) ||
           employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employer.phone.includes(searchTerm) ||
           employer.fydaId.includes(searchTerm) ||
           companyName.includes(searchTerm.toLowerCase()) ||
           businessType.includes(searchTerm.toLowerCase())
  })

  const handleStatusUpdate = async (employerId: string, newStatus: string) => {
    try {
      await updateUser(employerId, { status: newStatus as any })
    } catch (error) {
      console.error('Failed to update employer status:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employers Management</h1>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employers by name, email, company, or business type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredEmployers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              {employers.length === 0 ? "No employers registered yet" : "No employers match your search"}
            </CardContent>
          </Card>
        ) : (
          filteredEmployers.map((employer) => (
          <Card key={employer.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {employer.firstName} {employer.lastName}
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardTitle>
              <div className="flex items-center gap-1 text-blue-600">
                <Building className="h-4 w-4" />
                <span>{employer.companyName || 'Company not specified'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{employer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{employer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={employer.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {employer.status}
                  </Badge>
                  <span>Jobs Posted: {employer.jobsPosted || 0}</span>
                </div>
                {employer.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(employer.id!, 'verified')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(employer.id!, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  FYDA ID: {employer.fydaId}
                </div>
                <div className="text-sm text-gray-600">
                  Business: {employer.businessType || 'Not specified'}
                </div>
                <div className="text-sm text-gray-600">
                  Region: {employer.region} | City: {employer.city}
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}