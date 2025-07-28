"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { FileText, Shield, DollarSign, User, Building, CheckCircle } from "lucide-react"
import { Layout } from "../layout"

export default function DigitalContract() {
  const [step, setStep] = useState(1)
  const [contractData, setContractData] = useState({
    jobTitle: "",
    workerName: "",
    workerFydaId: "",
    employerName: "",
    employerFydaId: "",
    workDescription: "",
    startDate: "",
    endDate: "",
    paymentType: "hourly",
    hourlyRate: "",
    dailyRate: "",
    totalAmount: "",
    workLocation: "",
    workHours: "",
    terms: "",
  })
  const [workerOtp, setWorkerOtp] = useState("")
  const [employerOtp, setEmployerOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTPs = async () => {
    setIsLoading(true)
    // Simulate API call to send OTPs
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep(3)
  }

  const handleConfirmContract = async () => {
    setIsLoading(true)
    // Simulate API call to confirm contract
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep(4)
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNum ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-green-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step === 1 && "Contract Details"}
                {step === 2 && "Review Contract"}
                {step === 3 && "OTP Confirmation"}
                {step === 4 && "Contract Signed"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {step === 1 && "Fill in the job and payment details"}
                {step === 2 && "Review all contract terms before signing"}
                {step === 3 && "Both parties must confirm with OTP"}
                {step === 4 && "Digital contract successfully created"}
              </p>
            </div>
          </div>

          {/* Step 1: Contract Form */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Create Digital Contract
                </CardTitle>
                <CardDescription>Fill in all required details for the work agreement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Job Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={contractData.jobTitle}
                        onChange={(e) => setContractData({ ...contractData, jobTitle: e.target.value })}
                        placeholder="e.g., Construction Helper"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workLocation">Work Location</Label>
                      <Input
                        id="workLocation"
                        value={contractData.workLocation}
                        onChange={(e) => setContractData({ ...contractData, workLocation: e.target.value })}
                        placeholder="e.g., Addis Ababa, Bole"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="workDescription">Work Description</Label>
                    <Textarea
                      id="workDescription"
                      value={contractData.workDescription}
                      onChange={(e) => setContractData({ ...contractData, workDescription: e.target.value })}
                      placeholder="Describe the work to be performed..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Worker & Employer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Parties Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-green-600">Worker Details</h4>
                      <div>
                        <Label htmlFor="workerName">Full Name</Label>
                        <Input
                          id="workerName"
                          value={contractData.workerName}
                          onChange={(e) => setContractData({ ...contractData, workerName: e.target.value })}
                          placeholder="Worker's full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="workerFydaId">FYDA ID</Label>
                        <Input
                          id="workerFydaId"
                          value={contractData.workerFydaId}
                          onChange={(e) => setContractData({ ...contractData, workerFydaId: e.target.value })}
                          placeholder="Worker's FYDA ID"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-blue-600">Employer Details</h4>
                      <div>
                        <Label htmlFor="employerName">Company/Name</Label>
                        <Input
                          id="employerName"
                          value={contractData.employerName}
                          onChange={(e) => setContractData({ ...contractData, employerName: e.target.value })}
                          placeholder="Employer's name or company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="employerFydaId">FYDA ID</Label>
                        <Input
                          id="employerFydaId"
                          value={contractData.employerFydaId}
                          onChange={(e) => setContractData({ ...contractData, employerFydaId: e.target.value })}
                          placeholder="Employer's FYDA ID"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Time & Payment */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Time & Payment Terms
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={contractData.startDate}
                        onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={contractData.endDate}
                        onChange={(e) => setContractData({ ...contractData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label>Payment Type</Label>
                    <RadioGroup
                      value={contractData.paymentType}
                      onValueChange={(value) => setContractData({ ...contractData, paymentType: value })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly">Hourly Rate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily Rate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Amount</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {contractData.paymentType === "hourly" && (
                      <>
                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate (ETB)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={contractData.hourlyRate}
                            onChange={(e) => setContractData({ ...contractData, hourlyRate: e.target.value })}
                            placeholder="e.g., 15"
                          />
                        </div>
                        <div>
                          <Label htmlFor="workHours">Expected Hours per Day</Label>
                          <Input
                            id="workHours"
                            type="number"
                            value={contractData.workHours}
                            onChange={(e) => setContractData({ ...contractData, workHours: e.target.value })}
                            placeholder="e.g., 8"
                          />
                        </div>
                      </>
                    )}
                    {contractData.paymentType === "daily" && (
                      <div>
                        <Label htmlFor="dailyRate">Daily Rate (ETB)</Label>
                        <Input
                          id="dailyRate"
                          type="number"
                          value={contractData.dailyRate}
                          onChange={(e) => setContractData({ ...contractData, dailyRate: e.target.value })}
                          placeholder="e.g., 150"
                        />
                      </div>
                    )}
                    {contractData.paymentType === "fixed" && (
                      <div>
                        <Label htmlFor="totalAmount">Total Amount (ETB)</Label>
                        <Input
                          id="totalAmount"
                          type="number"
                          value={contractData.totalAmount}
                          onChange={(e) => setContractData({ ...contractData, totalAmount: e.target.value })}
                          placeholder="e.g., 2000"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Additional Terms */}
                <div>
                  <Label htmlFor="terms">Additional Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={contractData.terms}
                    onChange={(e) => setContractData({ ...contractData, terms: e.target.value })}
                    placeholder="Any additional terms, conditions, or requirements..."
                    rows={3}
                  />
                </div>

                <Button onClick={() => setStep(2)} className="w-full" size="lg">
                  Review Contract
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Review Contract */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Review Contract Terms
                </CardTitle>
                <CardDescription>Please review all details carefully before proceeding to signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Worker</h4>
                      <p className="font-medium">{contractData.workerName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">FYDA ID: {contractData.workerFydaId}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Employer</h4>
                      <p className="font-medium">{contractData.employerName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">FYDA ID: {contractData.employerFydaId}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Job Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Title:</strong> {contractData.jobTitle}
                      </div>
                      <div>
                        <strong>Location:</strong> {contractData.workLocation}
                      </div>
                      <div>
                        <strong>Start Date:</strong> {contractData.startDate}
                      </div>
                      <div>
                        <strong>End Date:</strong> {contractData.endDate}
                      </div>
                    </div>
                    <div className="mt-2">
                      <strong>Description:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{contractData.workDescription}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Payment Terms</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Payment Type:</strong> {contractData.paymentType}
                      </div>
                      {contractData.paymentType === "hourly" && (
                        <>
                          <div>
                            <strong>Hourly Rate:</strong> {contractData.hourlyRate} ETB
                          </div>
                          <div>
                            <strong>Hours per Day:</strong> {contractData.workHours}
                          </div>
                        </>
                      )}
                      {contractData.paymentType === "daily" && (
                        <div>
                          <strong>Daily Rate:</strong> {contractData.dailyRate} ETB
                        </div>
                      )}
                      {contractData.paymentType === "fixed" && (
                        <div>
                          <strong>Total Amount:</strong> {contractData.totalAmount} ETB
                        </div>
                      )}
                    </div>
                  </div>

                  {contractData.terms && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Additional Terms</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{contractData.terms}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Edit Contract
                  </Button>
                  <Button onClick={handleSendOTPs} disabled={isLoading} className="flex-1">
                    {isLoading ? "Sending OTPs..." : "Send OTP for Signatures"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: OTP Confirmation */}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Worker Signature</CardTitle>
                  <CardDescription>OTP sent to worker's phone number</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="workerOtp">Enter OTP</Label>
                    <Input
                      id="workerOtp"
                      type="text"
                      placeholder="000000"
                      value={workerOtp}
                      onChange={(e) => setWorkerOtp(e.target.value)}
                      className="text-center tracking-widest text-lg"
                      maxLength={6}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      By entering the OTP, {contractData.workerName} agrees to the contract terms
                    </p>
                    <Button variant="link" className="text-sm">
                      Resend OTP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Employer Signature</CardTitle>
                  <CardDescription>OTP sent to employer's phone number</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="employerOtp">Enter OTP</Label>
                    <Input
                      id="employerOtp"
                      type="text"
                      placeholder="000000"
                      value={employerOtp}
                      onChange={(e) => setEmployerOtp(e.target.value)}
                      className="text-center tracking-widest text-lg"
                      maxLength={6}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      By entering the OTP, {contractData.employerName} agrees to the contract terms
                    </p>
                    <Button variant="link" className="text-sm">
                      Resend OTP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <Button
                  onClick={handleConfirmContract}
                  disabled={workerOtp.length !== 6 || employerOtp.length !== 6 || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? "Creating Contract..." : "Confirm & Create Contract"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Contract Completed */}
          {step === 4 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Contract Successfully Created!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Both parties have digitally signed the contract. The agreement is now active and legally binding.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 max-w-md mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Contract ID:</span>
                      <span className="font-mono">ETH-2024-001234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline">Download Contract PDF</Button>
                  <Button>View Contract Details</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
