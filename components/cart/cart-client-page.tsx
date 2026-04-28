"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { euro, cn } from "@/lib/utils";
import { calculateShippingOptions, type ShippingOption } from "@/lib/shipping";

export function CartClientPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const shippingOptions = calculateShippingOptions(totalItems, subtotal);
  const [selectedShippingId, setSelectedShippingId] = useState<ShippingOption["id"]>(
    shippingOptions[0].id,
  );

  const currentOptions = calculateShippingOptions(totalItems, subtotal);
  const selectedOption =
    currentOptions.find((o) => o.id === selectedShippingId) ?? currentOptions[0];
  const shippingCost = selectedOption.price;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-5 px-5 py-12 text-center">
        <div className="rounded-full bg-[var(--color-surface-strong)] p-5">
          <ShoppingBag className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          Il tuo carrello è ancora vuoto.
        </h1>
        <p className="max-w-xl text-base leading-8 text-[var(--color-muted)]">
          Parti dal catalogo o dal configuratore per creare le tue bomboniere coordinate.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/catalogo">
            <Button variant="secondary">Vai al catalogo</Button>
          </Link>
          <Link href="/configuratore">
            <Button>Apri il configuratore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Carrello
          </p>
          <h1 className="font-display text-5xl text-[var(--color-foreground)]">
            {getTotalItems()} articoli pronti per il checkout.
          </h1>
        </div>

        {items.map((item) => (
          <Card key={item.id} className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative h-28 w-full overflow-hidden rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-surface)] md:w-32">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">
                    {item.customOptions ? (
                      <>
                        {[
                          item.customOptions.cupVariant,
                          item.customOptions.shirtType?.replace("tshirt-manica-corta", "T-shirt m/c").replace("tshirt-manica-lunga", "T-shirt m/l"),
                          item.customOptions.size,
                          item.customOptions.color,
                          item.customOptions.printPosition,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </>
                    ) : (
                      `${item.configuration.format} · ${item.configuration.paletteSize ?? item.configuration.size ?? ""} · ${item.configuration.event}`
                    )}
                  </p>
                  {(item.customOptions?.customText || item.configuration.names) ? (
                    <p className="text-sm text-[var(--color-muted)]">
                      {item.customOptions?.customText
                        ? `Testo: ${item.customOptions.customText}`
                        : `Per: ${item.configuration.names}`}
                    </p>
                  ) : null}
                </div>
                <p className="text-lg font-semibold text-[var(--color-accent)]">
                  {euro(item.totalPrice)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white">
                  <button
                    className="px-3 py-2"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-2"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-error)]"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Rimuovi
                </button>
              </div>
            </div>
          </Card>
        ))}

        {/* Shipping options selector */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="font-semibold text-[var(--color-foreground)]">Modalità di spedizione</p>
          </div>
          <div className="space-y-3">
            {currentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedShippingId(option.id)}
                className={cn(
                  "w-full rounded-[1.5rem] border px-4 py-3 text-left transition-all duration-200",
                  selectedShippingId === option.id
                    ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.06)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">{option.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                      {option.description} · {option.estimatedDays}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-[var(--color-foreground)]">
                    {option.price === 0 ? "Inclusa" : euro(option.price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {subtotal < 120 ? (
            <p className="text-xs text-[var(--color-muted)]">
              Aggiungi altri {euro(120 - subtotal)} per ottenere la spedizione gratuita.
            </p>
          ) : null}
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-5">
          <h2 className="font-display text-4xl text-[var(--color-foreground)]">
            Riepilogo ordine
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Subtotale</span>
              <span className="font-semibold">{euro(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">
                {selectedOption.label}
              </span>
              <span className="font-semibold">
                {shippingCost === 0 ? "Inclusa" : euro(shippingCost)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
              <span className="font-semibold text-[var(--color-foreground)]">Totale</span>
              <span className="text-2xl font-semibold text-[var(--color-accent)]">
                {euro(total)}
              </span>
            </div>
          </div>
          <Link
            href={`/checkout?shipping=${selectedShippingId}&shippingCost=${shippingCost}`}
          >
            <Button className="w-full" size="lg">
              Procedi al checkout
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
