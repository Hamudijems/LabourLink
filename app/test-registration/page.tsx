"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addUser, subscribeToUsers, FirebaseUser } from "@/services/firebase-services"

export default function TestRegistrationPage() {
  const [users, setUsers] = useState<FirebaseUser[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testWorkerRegistration = async () => {
    setIsLoading(true)
    try {
      const userData = {
        fydaId: `TEST-${Date.now()}`,
        firstName: "Test",
        lastName: "Worker",
        phone: "+251911111111",
        email: `testworker${Date.now()}@example.com`,
        region: "Addis Ababa",
        city: "Addis Ababa",
        userType: "worker" as const,
        skills: ["Testing", "Development"]
      }
      
      const userId = await addUser(userData)
      console.log("Worker created with ID:", userId)
      alert("Worker registered successfully!")
    } catch (error) {
      console.error("Failed to register worker:", error)
      alert("Failed to register worker: " + error)
    }
    setIsLoading(false)
  }

  const testEmployerRegistration = async () => {
    setIsLoading(true)
    try {
      const userData = {
        fydaId: `TEST-EMP-${Date.now()}`,
        firstName: "Test",
        lastName: "Employer",
        phone: "+251922222222",
        email: `testemployer${Date.now()}@example.com`,
        region: "Addis Ababa",
        city: "Addis Ababa",
        userType: "employer" as const,
        companyName: "Test Company",
        businessType: "Technology"
      }
      
      const userId = await addUser(userData)
      console.log("Employer created with ID:", userId)
      alert("Employer registered successfully!")
    } catch (error) {
      console.error("Failed to register employer:", error)
      alert("Failed to register employer: " + error)
    }
    setIsLoading(false)
  }

  const loadUsers = () => {
    const unsubscribe = subscribeToUsers((loadedUsers) => {
      setUsers(loadedUsers)
      console.log("Loaded users:", loadedUsers)
    })
    
    // Cleanup after 5 seconds
    setTimeout(() => unsubscribe(), 5000)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Registration System</h1>
      
      <div className="space-y-4 mb-8">
        <Button onClick={testWorkerRegistration} disabled={isLoading}>
          Test Worker Registration
        </Button>
        <Button onClick={testEmployerRegistration} disabled={isLoading}>
          Test Employer Registration
        </Button>
        <Button onClick={loadUsers}>
          Load All Users
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded">
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-gray-600">
                Type: {user.userType} | Status: {user.status} | Email: {user.email}
              </div>
              {user.skills && <div className="text-sm">Skills: {user.skills.join(", ")}</div>}
              {user.companyName && <div className="text-sm">Company: {user.companyName}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}