import { NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { getConfiguratorSettings, setConfiguratorSettings } from "@/lib/mock-db";
import type { ConfiguratorSettings } from "@/types";

export async function GET() {
  if (isSupabaseServerConfigured) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("configurator_settings")
        .select("value")
        .eq("key", "configurator")
        .single() as { data: { value: unknown } | null; error: Error | null };
      
      if (!error && data && data.value) {
        return NextResponse.json({ settings: data.value as ConfiguratorSettings });
      }
    }
  }
  
  // Fallback a mock-db
  return NextResponse.json({ settings: getConfiguratorSettings() });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ConfiguratorSettings;
  
  if (isSupabaseServerConfigured) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("configurator_settings")
        .upsert({ key: "configurator", value: body as unknown } as never, { onConflict: "key" });
      
      if (!error) {
        return NextResponse.json({ settings: body });
      }
    }
  }
  
  // Fallback a mock-db
  return NextResponse.json({ settings: setConfiguratorSettings(body) });
}
