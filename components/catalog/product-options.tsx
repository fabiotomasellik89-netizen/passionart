"use client";

import { useRef, useState } from "react";
import { ShoppingCart, Upload, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { euro } from "@/lib/utils";
import type {
  CupVariant,
  PrintPosition,
  Product,
  ProductCustomOptions,
  ShirtColor,
  ShirtSize,
  ShirtType,
} from "@/types";

const CUP_VARIANT_LABELS: Record<CupVariant, string> = {
  classica: "Classica",
  magica: "Magica (cambia colore)",
  "con-cucchiaio": "Con cucchiaino",
};

const SHIRT_TYPE_LABELS: Record<ShirtType, string> = {
  "tshirt-manica-corta": "Manica corta",
  "tshirt-manica-lunga": "Manica lunga",
  polo: "Polo",
};

const PRINT_POSITION_LABELS: Record<PrintPosition, string> = {
  fronte: "Solo fronte",
  retro: "Solo retro",
  entrambi: "Fronte + Retro",
};

const COLOR_LABELS: Record<ShirtColor, string> = {
  bianco: "Bianco",
  nero: "Nero",
  grigio: "Grigio",
  "blu-navy": "Blu Navy",
  rosso: "Rosso",
};

const COLOR_HEX: Record<ShirtColor, string> = {
  bianco: "#ffffff",
  nero: "#1a1a1a",
  grigio: "#9ca3af",
  "blu-navy": "#1e3a5f",
  rosso: "#dc2626",
};

export function ProductOptionsPanel({ product }: { product: Product }) {
  const { addProductWithOptions } = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMug = product.category === "tazze";
  const isShirt = product.category === "magliette";

  const [cupVariant, setCupVariant] = useState<CupVariant>(
    product.cupVariants?.[0] ?? "classica",
  );
  const [shirtType, setShirtType] = useState<ShirtType>(
    product.shirtTypes?.[0] ?? "tshirt-manica-corta",
  );
  const [size, setSize] = useState<ShirtSize>(product.sizes?.[0] ?? "M");
  const [color, setColor] = useState<ShirtColor>(product.colors?.[0] ?? "bianco");
  const [printPosition, setPrintPosition] = useState<PrintPosition>(
    product.printPositions?.[0] ?? "fronte",
  );
  const [customText, setCustomText] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearLogo() {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleAddToCart() {
    const options: ProductCustomOptions = {
      ...(isMug ? { cupVariant } : {}),
      ...(isShirt ? { shirtType, size, color, printPosition } : {}),
      ...(logoPreview ? { logoUrl: logoPreview } : {}),
      ...(customText ? { customText } : {}),
      quantity,
    };
    addProductWithOptions(product, options);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="space-y-5 border-t border-[var(--color-line)] pt-5">
      {/* Cup variant selector */}
      {isMug && product.cupVariants && product.cupVariants.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Variante tazza
          </p>
          <div className="flex flex-wrap gap-2">
            {product.cupVariants.map((v) => (
              <button
                key={v}
                onClick={() => setCupVariant(v)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  cupVariant === v
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                }`}
              >
                {CUP_VARIANT_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shirt type selector */}
      {isShirt && product.shirtTypes && product.shirtTypes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Tipo</p>
          <div className="flex flex-wrap gap-2">
            {product.shirtTypes.map((t) => (
              <button
                key={t}
                onClick={() => setShirtType(t)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  shirtType === t
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                }`}
              >
                {SHIRT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {isShirt && product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Taglia</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                  size === s
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {isShirt && product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Colore base
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={COLOR_LABELS[c]}
                className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                  color === c
                    ? "scale-110 border-[var(--color-accent)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-accent)]/60"
                } ${c === "bianco" ? "shadow-sm" : ""}`}
                style={{ background: COLOR_HEX[c] }}
              >
                {color === c && (
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                      c === "bianco" || c === "grigio"
                        ? "text-[var(--color-foreground)]"
                        : "text-white"
                    }`}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-muted)]">{COLOR_LABELS[color]}</p>
        </div>
      )}

      {/* Print position */}
      {isShirt && product.printPositions && product.printPositions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Posizione stampa
          </p>
          <div className="flex flex-wrap gap-2">
            {product.printPositions.map((p) => (
              <button
                key={p}
                onClick={() => setPrintPosition(p)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  printPosition === p
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                }`}
              >
                {PRINT_POSITION_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom text */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Testo personalizzato (opzionale)
        </p>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder={
            isMug ? "Es. Buon compleanno Marco!" : "Es. Team Marketing 2024"
          }
          className="w-full rounded-[1rem] border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      {/* Logo / image upload */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Logo / immagine da stampare (opzionale)
        </p>
        {logoPreview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoPreview}
              alt="Anteprima logo"
              className="h-24 w-24 rounded-[1rem] border border-[var(--color-line)] object-contain p-2"
            />
            <button
              onClick={clearLogo}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-foreground)] text-white shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-[1rem] border border-dashed border-[var(--color-line)] px-5 py-3 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Upload className="h-4 w-4" />
            Carica il tuo logo o immagine
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <p className="text-xs text-[var(--color-muted)]">PNG, JPG, SVG — max 5 MB</p>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Quantità
          </p>
          <div className="inline-flex items-center rounded-full border border-[var(--color-line)]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-[var(--color-foreground)]"
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-[var(--color-foreground)]"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Button className="w-full gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
            {added
              ? "Aggiunto al carrello!"
              : `Aggiungi al carrello · ${euro(product.basePrice * quantity)}`}
          </Button>
        </div>
      </div>

      <Link href="/catalogo">
        <Button variant="secondary" className="w-full">
          Torna al catalogo
        </Button>
      </Link>
    </div>
  );
}
