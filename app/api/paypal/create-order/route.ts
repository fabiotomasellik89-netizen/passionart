import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal/client";

export async function POST(request: Request) {
  const body = (await request.json()) as { amount?: number };

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: "Importo non valido" }, { status: 400 });
  }

  const order = await createPayPalOrder(body.amount);
  return NextResponse.json({ id: order.id });
}