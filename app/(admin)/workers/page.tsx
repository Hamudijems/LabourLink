"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Phone, Mail, CheckCircle, Search } from "lucide-react"

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [workers, setWorkers] = useState([
    {
      id: "1",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      phone: "+251911111111",
      status: "verified",
      fin: "6140798523917519",
      fan: "3126894653473958",
      isFaydaVerified: true,
      skills: ["Construction", "Carpentry"],
      registrationDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Fatima Ali",
      email: "fatima.ali@example.com",
      phone: "+251922222222",
      status: "pending",
      fin: "6230247319356120",
      fan: "4567891234567890",
      isFaydaVerified: true,
      skills: ["Cleaning", "Housekeeping"],
      registrationDate: "2024-01-20"
    }
  ])

  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const registeredWorkers = registeredUsers.filter((user: any) => user.userType === 'worker')
    setWorkers(prev => [...prev, ...registeredWorkers])
  }, [])

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone.includes(searchTerm) ||
    worker.fin.includes(searchTerm) ||
    worker.fan.includes(searchTerm) ||
    (Array.isArray(worker.skills) ? worker.skills.join(' ') : worker.skills).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusUpdate = (workerId: string, newStatus: string) => {
    setWorkers(prev => prev.map(worker => 
      worker.id === workerId ? { ...worker, status: newStatus } : worker
    ))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Workers Management</h1>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workers by name, email, phone, FIN/FAN, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredWorkers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              {workers.length === 0 ? "No workers registered yet" : "No workers match your search"}
            </CardContent>
          </Card>
        ) : (
          filteredWorkers.map((worker) => (
          <Card key={worker.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {worker.name}
                {worker.isFaydaVerified && <CheckCircle className="h-5 w-5 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{worker.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{worker.phone}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={worker.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {worker.status}
                  </Badge>
                  <span>Skills: {Array.isArray(worker.skills) ? worker.skills.join(', ') : worker.skills}</span>
                </div>
                {worker.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(worker.id, 'verified')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(worker.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  FIN: {worker.fin} | FAN: {worker.fan}
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