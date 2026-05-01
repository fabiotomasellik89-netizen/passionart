import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseServerConfigured = Boolean(url && key);

// Debug log (rimuovere in produzione)
if (typeof window === "undefined") {
  console.log("[Supabase Server] URL:", url ? "OK" : "MISSING");
  console.log("[Supabase Server] KEY:", key ? "OK" : "MISSING");
  console.log("[Supabase Server] Configured:", isSupabaseServerConfigured);
}

export function createServerSupabaseClient() {
  if (!isSupabaseServerConfigured) {
    return null;
  }

  return createClient<Database>(
    url as string,
    key as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
