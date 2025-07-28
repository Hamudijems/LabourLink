"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Shield, Smartphone, Settings } from "lucide-react"
import Link from "next/link"
import { Layout } from "./layout"

interface LandingPageProps {
  onAdminLogin?: () => void
}

export default function LandingPage({ onAdminLogin }: LandingPageProps) {
  return (
    <Layout>
      {/* Admin Login Button - Fixed position */}
      {onAdminLogin && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={onAdminLogin}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-green-200 text-green-700 hover:bg-green-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin Login
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect Workers & Employers in Ethiopia</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Secure, verified employment platform using your FYDA National ID. Find work or hire trusted workers with
            digital contracts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup?type=worker" className="flex-1">
              <Button size="lg" variant="secondary" className="w-full text-lg py-6">
                <Users className="mr-2 h-5 w-5" />
                I'm Looking for Work
              </Button>
            </Link>
            <Link href="/signup?type=employer" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 bg-white text-green-700 hover:bg-gray-100"
              >
                <Briefcase className="mr-2 h-5 w-5" />I Need Workers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose EthioWork?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>FYDA Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All users verified with Ethiopian FYDA National ID for maximum security and trust.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Mobile First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Designed for smartphones with simple, easy-to-use interface for all skill levels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-powered job matching based on location, skills, and availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Digital Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Secure digital contracts with OTP confirmation and automatic payment tracking.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Workers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-600">For Workers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sign up with FYDA ID</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Verify your identity using your Ethiopian National ID
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Get matched with jobs</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Receive job opportunities based on your skills and location
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Work & get paid</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Complete jobs and receive secure digital payments
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-600">For Employers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Post job requirements</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Describe the work, skills needed, and payment terms
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Review verified workers</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Browse profiles of FYDA-verified workers in your area
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Create digital contract</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Finalize terms with secure OTP-confirmed contracts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopians already using EthioWork to find employment opportunities and skilled workers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup?type=worker" className="flex-1">
              <Button size="lg" variant="secondary" className="w-full text-lg py-6">
                Sign Up as Worker
              </Button>
            </Link>
            <Link href="/signup?type=employer" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 bg-white text-green-700 hover:bg-gray-100"
              >
                Sign Up as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
