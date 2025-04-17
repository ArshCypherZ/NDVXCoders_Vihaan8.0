import { type NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"
import type { DecodedToken } from "./auth"

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>, allowedRoles?: string[]) {
  return async (req: NextRequest) => {
    // Get token from cookie
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    try {
      // Verify token
      const decoded = jwtDecode<DecodedToken>(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp < currentTime) {
        // Token expired
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      // Check role if specified
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      // Token is valid, proceed with the request
      return handler(req)
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }
}
