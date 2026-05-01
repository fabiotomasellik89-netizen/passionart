import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getConfiguratorSettings, setConfiguratorSettings } from "@/lib/mock-db";
import type { ConfiguratorSettings } from "@/types";

export async function GET() {
  console.log("[API /admin/configuratore] GET called");
  const supabase = createServerSupabaseClient();
  console.log("[API /admin/configuratore] Supabase client:", supabase ? "CREATED" : "NULL");
  
  if (supabase) {
    const { data, error } = await supabase
      .from("configurator_settings")
      .select("value")
      .eq("key", "configurator")
      .single() as { data: { value: unknown } | null; error: Error | null };
    
    console.log("[API /admin/configuratore] Supabase data:", data ? "FOUND" : "NOT FOUND");
    console.log("[API /admin/configuratore] Supabase error:", error ? error.message : "NONE");
    
    if (!error && data && data.value) {
      return NextResponse.json({ settings: data.value as ConfiguratorSettings });
    }
  }
  
  console.log("[API /admin/configuratore] FALLBACK to mock-db");
  return NextResponse.json({ settings: getConfiguratorSettings() });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ConfiguratorSettings;
  
  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("configurator_settings")
      .upsert({ key: "configurator", value: body as unknown } as never, { onConflict: "key" });
    
    if (!error) {
      return NextResponse.json({ settings: body });
    }
  }
  
  // Fallback a mock-db
  return NextResponse.json({ settings: setConfiguratorSettings(body) });
}
