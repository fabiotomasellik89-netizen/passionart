"use client";

import { useEffect, useState } from "react";
import { Clock3, Package, ShoppingBag, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

type DashboardData = {
  products: number;
  showcase: number;
  orders: number;
  inProgress: number;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({
    products: 0,
    showcase: 0,
    orders: 0,
    inProgress: 0,
  });

  useEffect(() => {
    Promise.all([fetch("/api/admin/products"), fetch("/api/admin/orders")])
      .then(async ([productsResponse, ordersResponse]) => {
        const productsJson = (await productsResponse.json()) as { products: Array<{ inspirationType: string }> };
        const ordersJson = (await ordersResponse.json()) as {
          orders: Array<{ status: string }>;
        };
        setData({
          products: productsJson.products.length,
          showcase: productsJson.products.filter(
            (item) => item.inspirationType === "showcase" || item.inspirationType === "both",
          ).length,
          orders: ordersJson.orders.length,
          inProgress: ordersJson.orders.filter((item) => item.status === "in-lavorazione").length,
        });
      })
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Prodotti attivi", value: data.products, icon: Package },
    { label: "Lavori in vetrina", value: data.showcase, icon: Sparkles },
    { label: "Ordini registrati", value: data.orders, icon: ShoppingBag },
    { label: "Ordini in lavorazione", value: data.inProgress, icon: Clock3 },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Dashboard
        </p>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          Pannello operativo PassionArt
        </h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="space-y-4">
            <card.icon className="h-5 w-5 text-[var(--color-accent)]" />
            <div>
              <p className="text-sm text-[var(--color-muted)]">{card.label}</p>
              <p className="font-display text-5xl text-[var(--color-foreground)]">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}