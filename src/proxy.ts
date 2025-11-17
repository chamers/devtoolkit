import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/admin/dashboard"];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  // In App Router, (auth) is a folder group — not in the actual URL.
  // So we check for real route paths like /signin or /signup.
  const isOnAuthRoute =
    nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup";

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
