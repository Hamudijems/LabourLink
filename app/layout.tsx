import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/auth/auth-context"
import { UserProvider } from "@/components/context/user-context"
import { AppDataProvider } from "@/components/context/app-data-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "EthioWork - Ethiopian Labor Platform",
  description: "Connecting Ethiopian workers with employers through digital contracts and FYDA ID verification",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <AppDataProvider>{children}</AppDataProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
