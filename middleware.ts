import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Disabilitato temporaneamente per debug
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
