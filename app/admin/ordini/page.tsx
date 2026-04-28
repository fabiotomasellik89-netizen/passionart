"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { euro, formatDate } from "@/lib/utils";
import type { OrderRecord } from "@/types";

export default function AdminOrdiniPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  if (!hasLoaded) {
    setHasLoaded(true);
    fetch("/api/admin/orders")
      .then((response) => response.json())
      .then((json: { orders: OrderRecord[] }) => setOrders(json.orders))
      .catch(() => undefined);
  }

  async function updateStatus(
    id: string,
    status: OrderRecord["status"],
    paymentStatus: OrderRecord["paymentStatus"],
  ) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus }),
    });
    const response = await fetch("/api/admin/orders");
    const json = (await response.json()) as { orders: OrderRecord[] };
    setOrders(json.orders);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Ordini
        </p>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          Storico e lavorazione
        </h1>
      </div>
      {orders.map((order) => (
        <Card key={order.id} className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">{order.customer.fullName}</p>
              <p className="text-sm text-[var(--color-muted)]">{order.customer.email}</p>
              <p className="text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</p>
            </div>
            <p className="text-xl font-semibold text-[var(--color-accent)]">
              {euro(order.total)}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              value={order.status}
              onChange={(event) =>
                updateStatus(
                  order.id,
                  event.target.value as OrderRecord["status"],
                  order.paymentStatus,
                )
              }
            >
              <option value="bozza">Bozza</option>
              <option value="pagato">Pagato</option>
              <option value="in-lavorazione">In lavorazione</option>
              <option value="spedito">Spedito</option>
            </Select>
            <Select
              value={order.paymentStatus}
              onChange={(event) =>
                updateStatus(
                  order.id,
                  order.status,
                  event.target.value as OrderRecord["paymentStatus"],
                )
              }
            >
              <option value="pending">Pending</option>
              <option value="captured">Captured</option>
            </Select>
          </div>
        </Card>
      ))}
    </div>
  );
}