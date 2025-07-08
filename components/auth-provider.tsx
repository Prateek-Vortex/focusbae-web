"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("focusbae_token")
      if (storedToken) {
        setToken(storedToken)
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/signup", "/forgot-password"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!isAuthenticated && !isPublicPath) {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = (newToken: string) => {
    localStorage.setItem("focusbae_token", newToken)
    setToken(newToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("focusbae_token")
    setToken(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
