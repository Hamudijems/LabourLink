"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserPlus,
  BarChart3,
  FileText,
  Sun,
  Moon,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
  adminEmail: string
}

export default function AdminLayout({ children, currentPage, onPageChange, onLogout, adminEmail }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSignOut = () => {
    onLogout()
  }

  const menuItems = [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "System overview and analytics",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      description: "Manage workers and employers",
    },
    {
      id: "worker-dashboard",
      label: "Worker View",
      icon: Users,
      description: "Preview worker dashboard",
    },
    {
      id: "employer-dashboard",
      label: "Employer View",
      icon: Briefcase,
      description: "Preview employer dashboard",
    },
    {
      id: "worker-registration",
      label: "Worker Registration",
      icon: UserPlus,
      description: "Worker signup process",
    },
    {
      id: "contract",
      label: "Digital Contracts",
      icon: FileText,
      description: "Contract management system",
    },
  ]

  const handleMenuClick = (pageId: string) => {
    onPageChange(pageId)
    setIsSidebarOpen(false)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="bg-green-600 dark:bg-green-700 text-white shadow-lg sticky top-0 z-50">
          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white hover:bg-green-700"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8" />
                  <div>
                    <h1 className="text-xl font-bold">EthioWork Admin</h1>
                    <p className="text-xs text-green-200">Management Dashboard</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="text-white hover:bg-green-700">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* Quick Sign Out Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign Out</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to sign out of the admin panel? You'll need to log in again to access the
                        dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-green-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-medium">Admin</p>
                          <p className="text-xs text-green-200">{adminEmail}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          >
            <div className="flex flex-col h-full pt-16 lg:pt-0">
              <div className="flex-1 px-4 py-6 space-y-2">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Admin Panel</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Manage your labor platform</p>
                </div>

                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${isActive ? "text-green-600" : "text-gray-500"}`} />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">System Status</p>
                          <p className="text-xs text-green-600">All systems operational</p>
                        </div>
                      </div>

                      {/* Additional Sign Out Button in Sidebar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Sign Out</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to sign out of the admin panel?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                              Sign Out
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-800">{children}</main>
        </div>
      </div>
    </div>
  )
}
