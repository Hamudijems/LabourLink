"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import Link from "next/link"

interface LayoutProps {
  children: React.ReactNode
  userType?: "worker" | "employer" | null
}

export function Layout({ children, userType = null }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="bg-green-600 dark:bg-green-700 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold">
                EthioWork
              </Link>

              <div className="hidden md:flex items-center space-x-4">
                {userType === "worker" && (
                  <>
                    <Link href="/worker/dashboard" className="hover:text-green-200">
                      Dashboard
                    </Link>
                    <Link href="/worker/jobs" className="hover:text-green-200">
                      Jobs
                    </Link>
                    <Link href="/worker/profile" className="hover:text-green-200">
                      Profile
                    </Link>
                  </>
                )}
                {userType === "employer" && (
                  <>
                    <Link href="/employer/dashboard" className="hover:text-green-200">
                      Dashboard
                    </Link>
                    <Link href="/employer/post-job" className="hover:text-green-200">
                      Post Job
                    </Link>
                    <Link href="/employer/applicants" className="hover:text-green-200">
                      Applicants
                    </Link>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="text-white hover:text-green-200">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-green-500">
                <div className="flex flex-col space-y-2">
                  {userType === "worker" && (
                    <>
                      <Link href="/worker/dashboard" className="py-2 hover:text-green-200">
                        Dashboard
                      </Link>
                      <Link href="/worker/jobs" className="py-2 hover:text-green-200">
                        Jobs
                      </Link>
                      <Link href="/worker/profile" className="py-2 hover:text-green-200">
                        Profile
                      </Link>
                    </>
                  )}
                  {userType === "employer" && (
                    <>
                      <Link href="/employer/dashboard" className="py-2 hover:text-green-200">
                        Dashboard
                      </Link>
                      <Link href="/employer/post-job" className="py-2 hover:text-green-200">
                        Post Job
                      </Link>
                      <Link href="/employer/applicants" className="py-2 hover:text-green-200">
                        Applicants
                      </Link>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="justify-start text-white hover:text-green-200"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-800">{children}</main>
      </div>
    </div>
  )
}
