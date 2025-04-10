import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified auth check. In a real app, you would verify
// the session token with your backend or auth provider.
function isAuthenticated(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token")
  return !!authCookie?.value
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If user is on the login page but already authenticated,
  // redirect to dashboard
  if (pathname === "/login" && isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user is trying to access protected routes but not authenticated,
  // redirect to login
  if (pathname !== "/login" && !pathname.startsWith("/_next") && !pathname.includes(".") && !isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (robots.txt, favicon.ico, etc.)
     */
    "/((?!api|_next|fonts|images|_vercel|[\\w-]+\\.\\w+).*)",
  ],
}
