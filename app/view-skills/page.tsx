"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Star, Phone, Mail, MapPin } from "lucide-react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { FirebaseUser } from "@/services/firebase-services"

export default function ViewSkillsPage() {
  const [fin, setFin] = useState("")
  const [fan, setFan] = useState("")
  const [userData, setUserData] = useState<FirebaseUser | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!fin.trim() || !fan.trim()) return
    
    setIsLoading(true)
    setError("")
    setUserData(null)

    try {
      if (!db) {
        setError("Database not available")
        setIsLoading(false)
        return
      }

      const faydaId = `${fin.trim()}-${fan.trim()}`
      const q = query(
        collection(db, "users"),
        where("fydaId", "==", faydaId)
      )

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setError("No user found with this Fayda ID")
          setUserData(null)
        } else {
          const doc = querySnapshot.docs[0]
          const user = { id: doc.id, ...doc.data() } as FirebaseUser
          setUserData(user)
          setError("")
        }
        setIsLoading(false)
      }, (error) => {
        setError("Failed to fetch user data")
        setIsLoading(false)
      })

      setTimeout(() => unsubscribe(), 10000)
    } catch (error) {
      setError("Search failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">View Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fin">FIN (Fayda Identification Number)</Label>
                  <Input
                    id="fin"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                    placeholder="Enter FIN (e.g., 6140798523917519)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="fan">FAN (Fayda Account Number)</Label>
                  <Input
                    id="fan"
                    value={fan}
                    onChange={(e) => setFan(e.target.value)}
                    placeholder="Enter FAN (e.g., 3126894653473958)"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleSearch}
                disabled={!fin || !fan || isLoading}
                className="w-full"
              >
                {isLoading ? "Searching..." : "Search User"}
              </Button>
              
              {userData && (
                <div className="space-y-6 mt-6 p-4 border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <User className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
                    <p className="text-gray-600">Fayda ID: {userData.fydaId}</p>
                    <Badge variant={userData.status === 'verified' ? 'default' : 'secondary'} className="mt-2">
                      {userData.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{userData.city}, {userData.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm capitalize">{userData.userType}</span>
                    </div>
                  </div>
                  
                  {userData.skills && userData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.userType === 'employer' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Company Information</h3>
                      <p><strong>Company:</strong> {userData.companyName}</p>
                      <p><strong>Business Type:</strong> {userData.businessType}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}