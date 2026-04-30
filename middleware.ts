import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "passionart_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass per login e API
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Proteggi tutte le route /admin
  if (pathname.startsWith("/admin")) {
    const isAuthenticated = request.cookies.get(ADMIN_COOKIE)?.value === "authenticated";
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
