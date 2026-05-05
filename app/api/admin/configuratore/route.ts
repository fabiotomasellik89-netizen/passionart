import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ConfiguratorSettings } from "@/types";

// Hardcoded per produzione
const SUPABASE_URL = "https://zdzjgugxmbseyhapeqms.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkempndWd4bWJzZXloYXBlcW1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2NTU1OTQsImV4cCI6MjA5MzE0MTU5NH0.uc2JzfvacEx_0twwDWhy4Rbd3_c28bgRrMDQH0yMhj4";

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("configurator_settings")
    .select("value")
    .eq("key", "configurator")
    .single();
  
  if (!error && data && data.value) {
    return NextResponse.json({ settings: data.value as ConfiguratorSettings });
  }
  
  // Se non trova dati, ritorna default
  return NextResponse.json({ settings: null });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ConfiguratorSettings;
  
  const supabase = getSupabase();
  const { error } = await supabase
    .from("configurator_settings")
    .upsert({ key: "configurator", value: body }, { onConflict: "key" });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ settings: body });
}
