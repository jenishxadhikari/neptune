import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

const authRoutes = ["/login", "/register"]
const protectedRoutes = ["/profile"]
const adminRoutes = "/admin"

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthRoute = authRoutes.includes(path)
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAdminRoute = path.startsWith(adminRoutes)

  let payload = await auth()

  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAdminRoute && payload?.userRole !== "admin") {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next();
}
