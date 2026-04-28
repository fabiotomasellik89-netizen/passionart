import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/mock-db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: "bozza" | "pagato" | "in-lavorazione" | "spedito";
    paymentStatus?: "pending" | "captured";
  };
  const order = updateOrderStatus(id, body);

  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }

  return NextResponse.json({ order });
}