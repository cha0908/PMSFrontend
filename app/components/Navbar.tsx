"use client"

import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-900 p-4 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-xl font-bold hover:scale-105 transition-transform">
          Position Management System
        </Link>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}