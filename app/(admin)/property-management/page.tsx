"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { 
  Shield, 
  Search, 
  Eye, 
  RefreshCw,
  AlertTriangle,
  Car,
  Home,
  CreditCard,
  Banknote,
  Gem,
  Monitor,
  Building,
  Package
} from "lucide-react"

interface Property {
  type: string
  description: string
  value: string
  location?: string
  documents?: string
}

interface PropertyOwner {
  id: string
  fin: string
  fan: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  properties: Property[]
  totalValue: number
  registrationDate: string
  faydaVerified: boolean
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
}

export default function PropertyManagement() {
  const [owners, setOwners] = useState<PropertyOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all")
  const [selectedOwner, setSelectedOwner] = useState<PropertyOwner | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const propertiesCollection = collection(db, "properties")
      const propertySnapshot = await getDocs(propertiesCollection)
      const propertyList = propertySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          fin: data.fin || "",
          fan: data.fan || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          properties: data.properties || [],
          totalValue: data.totalValue || 0,
          registrationDate: data.registrationDate || "",
          faydaVerified: data.faydaVerified || false,
          emergencyContact: data.emergencyContact || { name: "", phone: "", relation: "" }
        }
      }) as PropertyOwner[]
      
      console.log("Fetched properties:", propertyList)
      setOwners(propertyList)
    } catch (err) {
      setError("Failed to fetch properties from Firebase: " + (err as Error).message)
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "vehicle": return <Car className="h-4 w-4" />
      case "real-estate": return <Home className="h-4 w-4" />
      case "bank-account": return <CreditCard className="h-4 w-4" />
      case "cash": return <Banknote className="h-4 w-4" />
      case "jewelry": return <Gem className="h-4 w-4" />
      case "electronics": return <Monitor className="h-4 w-4" />
      case "business": return <Building className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getPropertyTypeColor = (type: string) => {
    const colors = {
      "vehicle": "bg-blue-100 text-blue-800",
      "real-estate": "bg-green-100 text-green-800",
      "bank-account": "bg-purple-100 text-purple-800",
      "cash": "bg-yellow-100 text-yellow-800",
      "jewelry": "bg-pink-100 text-pink-800",
      "electronics": "bg-gray-100 text-gray-800",
      "business": "bg-orange-100 text-orange-800",
      "other": "bg-indigo-100 text-indigo-800"
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch = 
      `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.fin.includes(searchTerm) ||
      owner.fan.includes(searchTerm)
    
    const matchesPropertyType = propertyTypeFilter === "all" || 
      owner.properties.some(prop => prop.type === propertyTypeFilter)
    
    return matchesSearch && matchesPropertyType
  })

  const stats = {
    totalOwners: owners.length,
    totalProperties: owners.reduce((sum, owner) => sum + owner.properties.length, 0),
    totalValue: owners.reduce((sum, owner) => sum + owner.totalValue, 0),
    verifiedOwners: owners.filter(owner => owner.faydaVerified).length
  }

  const propertyTypes = Array.from(new Set(owners.flatMap(owner => owner.properties.map(prop => prop.type))))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Property Owners</p>
                <p className="text-2xl font-bold">{stats.totalOwners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Banknote className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} ETB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Owners</p>
                <p className="text-2xl font-bold">{stats.verifiedOwners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Property Management
            <Button onClick={fetchProperties} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Manage registered properties and verify ownership claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, FIN, or FAN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Property Types</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Owners Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>FIN/FAN</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading properties...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOwners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No property owners found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                          <p className="text-sm text-gray-500">{owner.email}</p>
                          <p className="text-sm text-gray-500">{owner.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">FIN:</div>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded block">{owner.fin}</code>
                          <div className="text-xs text-gray-500">FAN:</div>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded block">{owner.fan}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{owner.properties.length} properties</div>
                          <div className="flex flex-wrap gap-1">
                            {owner.properties.slice(0, 3).map((property, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className={`text-xs ${getPropertyTypeColor(property.type)}`}
                              >
                                {getPropertyIcon(property.type)}
                                <span className="ml-1">{property.type.replace("-", " ")}</span>
                              </Badge>
                            ))}
                            {owner.properties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{owner.properties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{owner.totalValue.toLocaleString()} ETB</span>
                      </TableCell>
                      <TableCell>{owner.registrationDate}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOwner(owner)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Property Details Dialog */}
      <Dialog open={!!selectedOwner} onOpenChange={() => setSelectedOwner(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Property Details - {selectedOwner?.firstName} {selectedOwner?.lastName}
            </DialogTitle>
            <DialogDescription>Complete property ownership information</DialogDescription>
          </DialogHeader>
          {selectedOwner && (
            <div className="space-y-6">
              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">FIN</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedOwner.fin}</code>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">FAN</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedOwner.fan}</code>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p>{selectedOwner.firstName} {selectedOwner.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p>{selectedOwner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p>{selectedOwner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Date</p>
                    <p>{selectedOwner.registrationDate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p>{selectedOwner.address}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p>{selectedOwner.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p>{selectedOwner.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Relationship</p>
                    <p>{selectedOwner.emergencyContact.relation}</p>
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Registered Properties ({selectedOwner.properties.length})
                </h3>
                <div className="space-y-4">
                  {selectedOwner.properties.map((property, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          {getPropertyIcon(property.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getPropertyTypeColor(property.type)}>
                                {property.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                              <span className="font-medium text-lg">
                                {parseFloat(property.value).toLocaleString()} ETB
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{property.description}</p>
                            {property.location && (
                              <p className="text-sm text-gray-600">
                                <strong>Location:</strong> {property.location}
                              </p>
                            )}
                            {property.documents && (
                              <p className="text-sm text-gray-600">
                                <strong>Documents:</strong> {property.documents}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-800">
                    Total Property Value: {selectedOwner.totalValue.toLocaleString()} ETB
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}