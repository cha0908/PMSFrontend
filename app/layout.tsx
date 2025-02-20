import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "./contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Stock Position Management",
  description: "A simple stock position management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

