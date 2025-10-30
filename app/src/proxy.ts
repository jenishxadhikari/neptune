import { NextRequest, NextResponse } from 'next/server'

import { verifyToken } from '@/lib/auth'

const authRoutes = ["/login", "/register"]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionToken = request.cookies.get('sessionToken')?.value
  const isAuthRoute = authRoutes.includes(path)

  if (sessionToken) {
    const payload = await verifyToken(sessionToken)
    if (payload) {
      const { userId, userRole } = payload
      if (isAuthRoute && userId) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
}
