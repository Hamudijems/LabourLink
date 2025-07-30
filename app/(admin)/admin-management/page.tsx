"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Plus, Trash2 } from "lucide-react"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"

interface AdminUser {
  id: string
  email: string
  allowedPages: string[]
  createdAt: string
}

const AVAILABLE_PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'workers', label: 'Workers Management' },
  { id: 'employers', label: 'Employers Management' },
  { id: 'user-management', label: 'User Management' },
  { id: 'student-registration', label: 'Student Registration' },
  { id: 'k12-registration', label: 'K-12 Registration' },
  { id: 'student-graduation', label: 'Student Graduation' },
  { id: 'property-management', label: 'Property Management' },
]

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"))
      const adminList: AdminUser[] = []
      querySnapshot.forEach((doc) => {
        adminList.push({ id: doc.id, ...doc.data() } as AdminUser)
      })
      setAdmins(adminList)
    } catch (error) {
      console.error('Failed to load admins:', error)
    }
  }

  const handleCreateAdmin = async () => {
    if (!email || !password || selectedPages.length === 0) {
      alert('Please fill all fields and select at least one page')
      return
    }

    setIsLoading(true)
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Store admin data in Firestore
      await addDoc(collection(db, "admins"), {
        email,
        allowedPages: selectedPages,
        createdAt: new Date().toISOString(),
        userId: userCredential.user.uid
      })
      
      alert('Admin created successfully!')
      setEmail("")
      setPassword("")
      setSelectedPages([])
      setShowCreateForm(false)
      loadAdmins()
    } catch (error: any) {
      alert('Failed to create admin: ' + error.message)
    }
    setIsLoading(false)
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteDoc(doc(db, "admins", adminId))
        loadAdmins()
      } catch (error) {
        alert('Failed to delete admin')
      }
    }
  }

  const togglePage = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(p => p !== pageId)
        : [...prev, pageId]
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Admin
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div>
              <Label>Select Pages This Admin Can Access</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {AVAILABLE_PAGES.map((page) => (
                  <div key={page.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={page.id}
                      checked={selectedPages.includes(page.id)}
                      onCheckedChange={() => togglePage(page.id)}
                    />
                    <Label htmlFor={page.id} className="font-medium">
                      {page.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAdmin} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Admin'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{admin.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {admin.allowedPages.map((pageId) => (
                      <Badge key={pageId} variant="secondary" className="text-xs">
                        {AVAILABLE_PAGES.find(p => p.id === pageId)?.label || pageId}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAdmin(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}