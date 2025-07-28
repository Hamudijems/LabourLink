"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "./components/auth/auth-context"
import { UserProvider } from "./components/context/user-context"
import { AppDataProvider } from "./components/context/app-data-context"
import AdminLogin from "./components/auth/admin-login"
import AdminLayout from "./components/admin/admin-layout"
import LandingPage from "./components/landing-page"
import SignupPage from "./components/auth/signup"
import WorkerDashboard from "./components/worker/dashboard"
import EmployerDashboard from "./components/employer/dashboard"
import DigitalContract from "./components/contract/digital-contract"
import ManagementDashboard from "./components/admin/management-dashboard"
import WorkerRegistration from "./components/worker/worker-registration"
import UserManagement from "./components/admin/user-management"

function AppContent() {
  const { isAuthenticated, adminEmail, login, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("landing")
  const [adminPage, setAdminPage] = useState("admin-dashboard")

  // Check for stored auth on mount
  useEffect(() => {
    const stored = localStorage.getItem("adminAuth")
    if (stored) {
      try {
        const { email, authenticated } = JSON.parse(stored)
        if (authenticated && email === "hamudijems4@gmail.com") {
          // Auto-login if valid stored auth
          login(email, "ahmed123")
        }
      } catch (error) {
        localStorage.removeItem("adminAuth")
      }
    }
  }, [login])

  // Public pages (accessible without login)
  const renderPublicPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onAdminLogin={() => setCurrentPage("login")} />
      case "signup":
        return <SignupPage />
      case "login":
        return <AdminLogin onLogin={login} />
      default:
        return <LandingPage onAdminLogin={() => setCurrentPage("login")} />
    }
  }

  // Protected admin pages
  const renderAdminPage = () => {
    switch (adminPage) {
      case "admin-dashboard":
        return <ManagementDashboard />
      case "user-management":
        return <UserManagement />
      case "worker-dashboard":
        return <WorkerDashboard />
      case "employer-dashboard":
        return <EmployerDashboard />
      case "worker-registration":
        return <WorkerRegistration />
      case "contract":
        return <DigitalContract />
      default:
        return <ManagementDashboard />
    }
  }

  // If authenticated, show admin interface
  if (isAuthenticated && adminEmail) {
    return (
      <AdminLayout currentPage={adminPage} onPageChange={setAdminPage} onLogout={logout} adminEmail={adminEmail}>
        {renderAdminPage()}
      </AdminLayout>
    )
  }

  // Show public pages or login
  return (
    <div className="min-h-screen">
      {currentPage === "login" ? (
        <AdminLogin onLogin={login} />
      ) : (
        <>
          {renderPublicPage()}

          {/* Public Navigation - Only show landing and signup */}
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
            <div className="text-xs text-gray-500 mb-2">Public Pages:</div>
            <div className="flex flex-col space-y-1 text-xs">
              <button onClick={() => setCurrentPage("landing")} className="text-left hover:text-green-600">
                Landing Page
              </button>
              <button onClick={() => setCurrentPage("signup")} className="text-left hover:text-green-600">
                User Signup
              </button>
              <button
                onClick={() => setCurrentPage("login")}
                className="text-left hover:text-green-600 font-medium text-green-600"
              >
                Admin Login
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppDataProvider>
          <AppContent />
        </AppDataProvider>
      </UserProvider>
    </AuthProvider>
  )
}
