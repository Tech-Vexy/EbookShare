"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService, type AuthUser } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    console.log("[v0] Auth provider attempting login")
    try {
      await authService.login(email, password)
      await checkUser()
      console.log("[v0] Auth provider login successful")
    } catch (error) {
      console.log("[v0] Auth provider login failed:", error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    console.log("[v0] Auth provider attempting registration")
    try {
      await authService.createAccount(email, password, name)
      console.log("[v0] Account created, attempting auto-login")
      await authService.login(email, password)
      await checkUser()
      console.log("[v0] Auth provider registration and login successful")
    } catch (error) {
      console.log("[v0] Auth provider registration failed:", error)
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
