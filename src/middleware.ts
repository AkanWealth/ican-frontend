import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  // If no token or user, redirect to login
  if (!token || !user) {
    // Don't redirect if already on login pages
    if (path.includes("/login") || path.includes("/admin-login")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Parse user to get role
  const userObj = user ? JSON.parse(user) : null;

  // Protect admin routes
  if (path.startsWith("/admin")) {
    // if (userObj?.role !== "SUPER_ADMIN" && userObj?.role !== "ADMIN") {
    //   // If user is logged in but not admin, redirect to dashboard
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }
  }

  // Prevent admin/super_admin from accessing regular dashboard
  if (path.startsWith("/dashboard")) {
    if (userObj?.role === "SUPER_ADMIN" || userObj?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Prevent accessing login pages when already authenticated
  if (path.includes("/login") || path.includes("/admin-login")) {
    if (userObj?.role === "SUPER_ADMIN" || userObj?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (userObj?.role === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/admin-login"],
};
