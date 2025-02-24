"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type User = {
  username: string
} | null

type AuthContextType = {
  user: User
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = "http://localhost:8080/api/auth" // Adjust this to match your backend URL

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const token = await response.text() // The backend returns the JWT token as a string
      const user = { username }
      
      // Store both the user and token
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      const userData = await response.json()
      // After successful signup, log the user in
      await login(username, password)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

