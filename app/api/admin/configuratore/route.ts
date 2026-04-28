import { NextResponse } from "next/server";
import { getConfiguratorSettings, setConfiguratorSettings } from "@/lib/mock-db";
import type { ConfiguratorSettings } from "@/types";

export async function GET() {
  return NextResponse.json({ settings: getConfiguratorSettings() });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ConfiguratorSettings;
  return NextResponse.json({ settings: setConfiguratorSettings(body) });
}
