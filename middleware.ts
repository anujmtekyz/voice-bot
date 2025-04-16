import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constants for token names matching those in lib/api.ts
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

// Check if user is authenticated based on refresh token
function isAuthenticated(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  return !!refreshToken?.value;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/";

  // If user is on a public page but already authenticated,
  // redirect to dashboard
  if (isPublicPath && isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is trying to access protected routes but not authenticated,
  // redirect to login
  if (
    !isPublicPath &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".") &&
    !pathname.startsWith("/api") &&
    !isAuthenticated(request)
  ) {
    // Save the original URL to redirect back after login
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
};
