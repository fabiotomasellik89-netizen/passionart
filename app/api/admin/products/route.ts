import { NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { listProducts, upsertProduct } from "@/lib/mock-db";

export async function GET() {
  if (isSupabaseServerConfigured) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*, images:product_images(*)");
      
      if (!error && data) {
        return NextResponse.json({ products: data });
      }
    }
  }
  
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  if (isSupabaseServerConfigured) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .upsert(body, { onConflict: "slug" })
        .select()
        .single();
      
      if (!error && data) {
        return NextResponse.json({ product: data });
      }
    }
  }
  
  return NextResponse.json({ product: upsertProduct(body) });
}
