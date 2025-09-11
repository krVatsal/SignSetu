import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Get the pathname of the request
  const { pathname } = req.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard']
  
  // Auth routes that authenticated users shouldn't access
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password']

  // For now, we'll let the client-side auth handle redirects
  // This middleware will be enhanced when we add server-side session management
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
