import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/constants";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isAuthenticated = request.cookies.get(adminCookieName)?.value === "authenticated";
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};