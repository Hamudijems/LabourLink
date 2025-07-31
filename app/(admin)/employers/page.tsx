"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Phone, Mail, Building, CheckCircle, Search, Eye, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={employer.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {employer.status}
                  </Badge>
                  <span>Jobs Posted: {employer.jobsPosted || 0}</span>
                </div>
                {(employer as any).businessSections && (employer as any).businessSections.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-sm text-gray-600">Sections:</span>
                    {(employer as any).businessSections.map((section: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">{section}</Badge>
                    ))}
                  </div>
                )}
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
                <div className="flex gap-2 mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{employer.firstName} {employer.lastName} - Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><strong>Email:</strong> {employer.email}</div>
                          <div><strong>Phone:</strong> {employer.phone}</div>
                          <div><strong>Region:</strong> {employer.region}</div>
                          <div><strong>City:</strong> {employer.city}</div>
                          <div><strong>Fayda ID:</strong> {employer.fydaId}</div>
                          <div><strong>Status:</strong> {employer.status}</div>
                          <div><strong>Company:</strong> {employer.companyName || 'Not specified'}</div>
                          <div><strong>Business Type:</strong> {employer.businessType || 'Not specified'}</div>
                        </div>
                        {(employer as any).businessSections && (employer as any).businessSections.length > 0 && (
                          <div>
                            <strong>Business Sections:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(employer as any).businessSections.map((section: string, index: number) => (
                                <Badge key={index} variant="secondary">{section}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {(employer as any).companyDocumentUrl && (
                          <div>
                            <strong>Company Document:</strong>
                            <div className="mt-2">
                              <Button 
                                onClick={() => window.open((employer as any).companyDocumentUrl, '_blank')}
                                variant="outline"
                                size="sm"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Company Document
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
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