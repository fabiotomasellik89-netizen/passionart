import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Hardcoded per produzione Vercel - NON committare in repo pubblica!
const PROD_URL = "https://zdzjgugxmbseyhapeqms.supabase.co";
const PROD_KEY = "";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PROD_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || PROD_KEY;

export const isSupabaseServerConfigured = Boolean(url && key);

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
