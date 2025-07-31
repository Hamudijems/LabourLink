"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Shield, Users, Briefcase, Star, ArrowRight, Phone, Mail, MapPin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="#" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LL</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SafeHire Ethiopia</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/login" className="text-sm font-medium text-green-600 hover:text-green-700">
              Login
            </Link>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    🇪🇹 Powered by Fayda ID Verification
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Ethiopia's Most
                    <span className="text-green-600"> Trusted</span>
                    <br />Employment Platform
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    Connect verified workers with trusted employers through secure digital contracts. 
                    Built for Ethiopia, powered by innovation.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                    <Link href="/signup?type=worker">
                      Join as Worker
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                    <Link href="/signup?type=employer">
                      Join as Employer
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">10K+</div>
                    <div className="text-sm text-gray-600">Verified Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Trusted Employers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-3xl blur-3xl opacity-20"></div>
                <img
                  src="/placeholder.jpg"
                  alt="Ethiopian workers and employers connecting"
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge className="bg-green-100 text-green-800">Key Features</Badge>
              <h2 className="text-3xl md:text-5xl font-bold">Why Choose SafeHire Ethiopia?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines cutting-edge technology with deep understanding of Ethiopian labor market
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <Shield className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Fayda ID Verification</h3>
                  <p className="text-gray-600">Every user is verified through Ethiopia's national ID system, ensuring authentic identities and preventing fraud.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <Briefcase className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Digital Contracts</h3>
                  <p className="text-gray-600">Secure, legally-binding digital contracts protect both workers and employers with clear terms and conditions.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Skill Verification</h3>
                  <p className="text-gray-600">Workers' skills and experience are verified by employers, creating a trusted talent database.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Academic Verification</h3>
                  <p className="text-gray-600">Educational credentials are automatically verified to prevent fake qualifications and ensure quality.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <Star className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Rating System</h3>
                  <p className="text-gray-600">Transparent rating system helps build trust and reputation within the community.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <Phone className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Emergency Services</h3>
                  <p className="text-gray-600">Health status registration enables emergency services to access critical information when needed.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge className="bg-green-100 text-green-800">Simple Process</Badge>
              <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Register with Fayda ID</h3>
                <p className="text-gray-600">Sign up using your Ethiopian national ID for instant verification and trust.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">Find or Post Jobs</h3>
                <p className="text-gray-600">Browse verified job opportunities or post your requirements to find the right talent.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Secure Digital Contract</h3>
                <p className="text-gray-600">Create legally-binding contracts with clear terms, payments, and protection for both parties.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to Transform Your Work Life?
              </h2>
              <p className="text-xl text-green-100">
                Join thousands of Ethiopians who trust SafeHire Ethiopia for secure, verified employment opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6">
                  <Link href="/signup?type=worker">Join as Worker</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6">
                  <Link href="/signup?type=employer">Join as Employer</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6">
                  <Link href="/property-registration">Register Properties</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6">
                  <Link href="/view-skills">View Skills</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LL</span>
                </div>
                <span className="font-bold text-xl">SafeHire Ethiopia</span>
              </div>
              <p className="text-gray-400">
                Ethiopia's most trusted platform for connecting verified workers with employers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Find Jobs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Post Jobs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Digital Contracts</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Verification</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Safety</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+251 11 XXX XXXX</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@labourlink.et</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Addis Ababa, Ethiopia</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 LabourLink Ethiopia. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
