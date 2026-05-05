import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zdzjgugxmbseyhapeqms.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET() {
  const { data, error } = await supabase
    .from("configurator_settings")
    .select("value")
    .eq("key", "configurator")
    .single();

  if (error || !data) {
    return NextResponse.json({ settings: null });
  }

  return NextResponse.json({ settings: data.value });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const { error } = await supabase
    .from("configurator_settings")
    .upsert({ key: "configurator", value: body }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: body });
}
