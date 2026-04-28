import { NextResponse } from "next/server";
import { getConfiguratorSettings } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(getConfiguratorSettings());
}
