import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zdzjgugxmbseyhapeqms.supabase.co";
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
    return NextResponse.json({});
  }

  return NextResponse.json(data.value);
}
