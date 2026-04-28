import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, adminDemoCredentials } from "@/lib/constants";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (
    body.email !== adminDemoCredentials.email ||
    body.password !== adminDemoCredentials.password
  ) {
    return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json({ success: true });
}