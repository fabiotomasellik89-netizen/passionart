import { NextResponse } from "next/server";
import { deleteProduct, getProductById, upsertProduct } from "@/lib/mock-db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const current = getProductById(id);
  if (!current) {
    return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
  }
  const body = await request.json();
  return NextResponse.json({ product: upsertProduct({ ...current, ...body, id }) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  deleteProduct(id);
  return NextResponse.json({ success: true });
}