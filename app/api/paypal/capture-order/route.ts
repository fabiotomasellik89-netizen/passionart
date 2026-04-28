import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal/client";
import { createOrder } from "@/lib/mock-db";
import type { CartItem, CustomerInfo } from "@/types";

function buildOrderNumber() {
  return `PA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string;
    orderData?: {
      customer: CustomerInfo;
      subtotal: number;
      shipping: number;
      total: number;
      items: CartItem[];
    };
  };

  if (!body.orderId || !body.orderData) {
    return NextResponse.json({ error: "Dati ordine mancanti" }, { status: 400 });
  }

  const capture = await capturePayPalOrder(body.orderId);

  if (capture.status !== "COMPLETED") {
    return NextResponse.json({ error: "Pagamento non completato" }, { status: 400 });
  }

  const orderNumber = buildOrderNumber();
  createOrder({
    status: "pagato",
    paymentStatus: "captured",
    paypalOrderId: body.orderId,
    total: body.orderData.total,
    customer: body.orderData.customer,
    items: body.orderData.items,
  });

  return NextResponse.json({ success: true, orderNumber });
}