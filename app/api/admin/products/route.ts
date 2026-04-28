import { NextResponse } from "next/server";
import { listProducts, upsertProduct } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ product: upsertProduct(body) });
}