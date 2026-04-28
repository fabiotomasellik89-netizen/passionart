import { NextResponse } from "next/server";
import { listOrders } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}