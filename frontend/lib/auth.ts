import { jwtDecode } from "jwt-decode"
import { secureStorage } from "./secure-storage"

export type UserRole = "hospital" | "manufacturer" | "regulator"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface DecodedToken {
  id: string
  name: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Helper function to get token from localStorage
const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const token = getTokenFromStorage() // Use localStorage
  if (!token) return false

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp < currentTime) {
      secureStorage.clearToken()
      return false
    }

    return true
  } catch (error) {
    secureStorage.clearToken()
    return false
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const token = getTokenFromStorage() // Use localStorage
  if (!token) return null

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp < currentTime) {
      secureStorage.clearToken()
      return null
    }

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    secureStorage.clearToken()
    return null
  }
}

export const logout = (): void => {
  if (typeof window === "undefined") return
  // Ensure localStorage is cleared on logout
  localStorage.removeItem("token")
  // secureStorage might also clear localStorage, but let's be explicit
  secureStorage.clearToken()
  window.location.href = "/auth/login"
}

export const hasRequiredRole = (requiredRoles: UserRole[]): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  return requiredRoles.includes(user.role)
}
