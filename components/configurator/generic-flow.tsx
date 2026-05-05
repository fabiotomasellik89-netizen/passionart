"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./configurator-client-page";
import type { ConfiguratorSettings, Product } from "@/types";

function euro(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function GenericFlow({
  category,
  settings,
  onBack,
}: {
  category: string;
  settings: ConfiguratorSettings;
  onBack: () => void;
}) {
  const router = useRouter();
  const addProductWithOptions = useCartStore((s) => s.addProductWithOptions);
  const catInfo = (settings.categories ?? []).find((c) => c.key === category);

  // Leggi varianti da categorySettings (con immagini, descrizioni, ecc.)
  const catSettings = settings.categorySettings?.[category];
  const variants = catSettings?.variants ?? [];
  const activeVariants = variants.filter((v) => v.active);

  // Fallback a customCategoryPrices se non ci sono varianti in categorySettings
  const prices = settings.customCategoryPrices?.[category] ?? {};
  const priceEntries = Object.entries(prices);

  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    activeVariants[0]?.key ?? priceEntries[0]?.[0] ?? null,
  );

  function handleAddToCart() {
    const variant = activeVariants.find((v) => v.key === selectedVariant);
    const unitPrice =
      variant?.price ??
      (selectedVariant && prices[selectedVariant] ? prices[selectedVariant] : 0);

    const product: Product = {
      id: `${category}-${Date.now()}`,
      slug: `${category}-personalizzato`,
      name: `${catInfo?.label ?? category} — ${variant?.label ?? "personalizzato"}`,
      shortDescription:
        note ||
        `Configurato tramite configuratore — categoria ${catInfo?.label ?? category}`,
      description: "",
      category: "bomboniere",
      eventType: "battesimo",
      basePrice: unitPrice,
      isFeatured: false,
      isActive: true,
      isCustomizable: true,
      inspirationType: "product",
      defaultShape: "rettangolo",
      supportedShapes: ["rettangolo"],
      materials: ["Personalizzato"],
      productionNotes: note,
      leadTimeDays: 14,
      badge: "Su misura",
      palette: [],
      images: [
        {
          id: "preview",
          url: variant?.img || "/images/logo.jpeg",
          alt: variant?.label ?? catInfo?.label ?? category,
          isCover: true,
        },
      ],
    };

    addProductWithOptions(product, {
      customText: note || undefined,
      quantity,
    });
    router.push("/carrello");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          {catInfo?.icon} {catInfo?.label ?? category}
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          {catInfo?.description ?? "Configura il tuo prodotto personalizzato."}
        </p>
      </div>

      {/* Varianti con immagini da categorySettings */}
      {activeVariants.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Variante / Tipologia
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeVariants.map((variant) => {
              const active = selectedVariant === variant.key;
              return (
                <button
                  key={variant.key}
                  type="button"
                  onClick={() => setSelectedVariant(variant.key)}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-[1.5rem] border p-6 text-center transition-all duration-200",
                    active
                      ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)] shadow-sm"
                      : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                  )}
                >
                  {variant.img ? (
                    <img
                      src={variant.img}
                      alt={variant.label}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-white/50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        active
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-foreground)]",
                      )}
                    >
                      {variant.label}
                    </p>
                    {variant.desc && (
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        {variant.desc}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-[rgba(191,79,123,0.08)] px-2.5 py-1 text-sm font-bold text-[var(--color-accent)]">
                    {euro(variant.price)}/pz
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback a customCategoryPrices */}
      {activeVariants.length === 0 && priceEntries.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Variante / Tipologia
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {priceEntries.map(([key, price]) => {
              const active = selectedVariant === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedVariant(key)}
                  className={cn(
                    "flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-left transition-all duration-200",
                    active
                      ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)] shadow-sm"
                      : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                  )}
                >
                  <p
                    className={cn(
                      "font-semibold",
                      active
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-foreground)]",
                    )}
                  >
                    {key}
                  </p>
                  <span className="rounded-full bg-[rgba(191,79,123,0.08)] px-2.5 py-1 text-sm font-bold text-[var(--color-accent)]">
                    {euro(price)}/pz
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          Note o personalizzazione{" "}
          <span className="text-xs font-normal text-[var(--color-muted)]">
            (opzionale)
          </span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Descrivi cosa desideri personalizzare, colori, misure, testo da includere..."
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
        />
        <p className="text-xs text-[var(--color-muted)]">
          {note.length}/500 caratteri
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          Quantità
        </p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          presets={[1, 5, 10, 20]}
          min={1}
          max={100}
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack}>
          ← Indietro
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90"
        >
          Aggiungi al carrello —{" "}
          {euro(
            (activeVariants.find((v) => v.key === selectedVariant)?.price ??
              (selectedVariant && prices[selectedVariant]
                ? prices[selectedVariant]
                : 0)) * quantity,
          )}
        </Button>
      </div>
    </div>
  );
}
