"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ShoppingCart, Upload, ImageIcon, Type, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { euro } from "@/lib/utils";
import {
  CANVAS_SIZES,
  CANVAS_TYPES,
  FRAME_TYPES,
  PREDEFINED_DESIGNS,
  calculateCanvasPrice,
} from "@/lib/canvas-pricing";
import type {
  ArtisticConfigSelection,
  CanvasPrintConfig,
  CanvasSizeKey,
  CanvasTextConfig,
  CanvasType,
  FrameType,
  Product,
} from "@/types";

const FONT_OPTIONS: { key: CanvasTextConfig["font"]; label: string; fontFamily: string }[] = [
  { key: "serif", label: "Elegante (Serif)", fontFamily: "Georgia, serif" },
  { key: "sans", label: "Moderno (Sans)", fontFamily: "Arial, sans-serif" },
  { key: "script", label: "Corsivo (Script)", fontFamily: "cursive" },
];

const TEXT_POSITIONS: { key: CanvasTextConfig["position"]; label: string }[] = [
  { key: "top", label: "In alto" },
  { key: "center", label: "Al centro" },
  { key: "bottom", label: "In basso" },
];

const DEFAULT_CANVAS_CONFIG: Omit<CanvasPrintConfig, "userImageUrl" | "designSlug" | "textConfig"> = {
  sizeKey: "40x60",
  width: 40,
  height: 60,
  canvasType: "classico",
  frameType: "senza",
  quantity: 1,
};

// ── Frame styles for preview ──────────────────────────────────────────────────
function frameStyle(frameType: FrameType): React.CSSProperties {
  if (frameType === "senza") return {};
  const frameColors: Record<string, string> = {
    "legno-naturale": "#c8a96e",
    "legno-scuro": "#3e2723",
    bianca: "#f0f0f0",
  };
  const color = frameColors[frameType] ?? "#c8a96e";
  return {
    border: `14px solid ${color}`,
    boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.12), 4px 6px 20px rgba(0,0,0,0.25)`,
  };
}

export function CanvasConfigurator({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  // ── State ─────────────────────────────────────────────────────────────────
  const [sizeKey, setSizeKey] = useState<CanvasSizeKey>(DEFAULT_CANVAS_CONFIG.sizeKey);
  const [customWidth, setCustomWidth] = useState(40);
  const [customHeight, setCustomHeight] = useState(50);
  const [canvasType, setCanvasType] = useState<CanvasType>("classico");
  const [frameType, setFrameType] = useState<FrameType>("senza");
  const [imageMode, setImageMode] = useState<"upload" | "gallery">("gallery");
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [designSlug, setDesignSlug] = useState<string | null>(PREDEFINED_DESIGNS[0].slug);
  const [textEnabled, setTextEnabled] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [textFont, setTextFont] = useState<CanvasTextConfig["font"]>("serif");
  const [textPosition, setTextPosition] = useState<CanvasTextConfig["position"]>("bottom");
  const [textColor, setTextColor] = useState("#ffffff");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Derived values ────────────────────────────────────────────────────────
  const sizeOption = CANVAS_SIZES.find((s) => s.key === sizeKey)!;
  const width = sizeKey === "personalizzata" ? customWidth : sizeOption.width;
  const height = sizeKey === "personalizzata" ? customHeight : sizeOption.height;

  const breakdown = calculateCanvasPrice(sizeKey, width, height, canvasType, frameType, quantity);
  const unitPrice = breakdown.total / quantity;

  const activeImage =
    imageMode === "upload" && userImageUrl
      ? userImageUrl
      : PREDEFINED_DESIGNS.find((d) => d.slug === designSlug)?.img ?? PREDEFINED_DESIGNS[0].img;

  // ── Canvas aspect ratio for preview ──────────────────────────────────────
  const aspectRatio = width / height;

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImageUrl(url);
    setImageMode("upload");
    setDesignSlug(null);
  }

  function handleAddToCart() {
    const canvasConfig: CanvasPrintConfig = {
      sizeKey,
      width,
      height,
      canvasType,
      frameType,
      userImageUrl: imageMode === "upload" ? (userImageUrl ?? undefined) : undefined,
      designSlug: imageMode === "gallery" ? (designSlug ?? undefined) : undefined,
      textConfig:
        textEnabled && textValue.trim()
          ? { text: textValue, font: textFont, position: textPosition, color: textColor }
          : undefined,
      quantity,
    };

    const fallbackConfig: ArtisticConfigSelection = {
      theme: "personalizzato",
      event: "altro",
      names: textEnabled ? textValue : product.name,
      preferredColors: [],
      format: "decorazione-quadretto",
      size: "media",
      confettiEnabled: false,
      veilEnabled: false,
      decoratedBasket: false,
      personalizedCard: false,
      quantity,
    };

    addItem({
      product,
      quantity,
      unitPrice,
      totalPrice: breakdown.total,
      breakdown,
      configuration: fallbackConfig,
      canvasConfig,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Link href={`/catalogo/${product.slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla scheda
          </Button>
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Configuratore Tela Stampata UV
          </p>
          <h1 className="font-display text-4xl leading-none text-[var(--color-foreground)]">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* ── Left: options ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Size */}
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">1. Misura</h2>
            <div className="flex flex-wrap gap-2">
              {CANVAS_SIZES.map((size) => (
                <button
                  key={size.key}
                  onClick={() => setSizeKey(size.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    sizeKey === size.key
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-line)] bg-white/60 text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
            {sizeKey === "personalizzata" && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted)]">
                    Larghezza (cm): {customWidth}
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--color-muted)]">
                    <span>15 cm</span><span>120 cm</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted)]">
                    Altezza (cm): {customHeight}
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--color-muted)]">
                    <span>15 cm</span><span>120 cm</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Canvas type */}
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">2. Tipo di Tela</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {CANVAS_TYPES.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setCanvasType(type.key)}
                  className={`flex items-start gap-3 rounded-[1.5rem] border p-4 text-left transition ${
                    canvasType === type.key
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-line)] bg-white/60 hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      canvasType === type.key
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    {canvasType === type.key && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {type.label}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Frame */}
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">3. Cornice</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {FRAME_TYPES.map((frame) => (
                <button
                  key={frame.key}
                  onClick={() => setFrameType(frame.key)}
                  className={`flex items-start gap-3 rounded-[1.5rem] border p-4 text-left transition ${
                    frameType === frame.key
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-line)] bg-white/60 hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      frameType === frame.key
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    {frameType === frame.key && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {frame.label}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {frame.description}
                      {frame.price > 0 && (
                        <span className="ml-1 font-medium text-[var(--color-accent)]">
                          +{euro(frame.price)}
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Image */}
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">4. Immagine</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setImageMode("gallery")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  imageMode === "gallery"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] bg-white/60 hover:border-[var(--color-accent)]"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Design predefiniti
              </button>
              <button
                onClick={() => { setImageMode("upload"); fileRef.current?.click(); }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  imageMode === "upload"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-line)] bg-white/60 hover:border-[var(--color-accent)]"
                }`}
              >
                <Upload className="h-4 w-4" />
                Carica foto
              </button>
            </div>

            {imageMode === "gallery" && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {PREDEFINED_DESIGNS.map((design) => (
                  <button
                    key={design.slug}
                    onClick={() => { setDesignSlug(design.slug); }}
                    className={`group relative overflow-hidden rounded-[1rem] border-2 transition ${
                      designSlug === design.slug
                        ? "border-[var(--color-accent)]"
                        : "border-transparent hover:border-[var(--color-accent)]/50"
                    }`}
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={design.img}
                        alt={design.label}
                        fill
                        className="object-cover"
                        sizes="100px"
                        unoptimized
                      />
                    </div>
                    {designSlug === design.slug && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent)]/20">
                        <Check className="h-5 w-5 text-[var(--color-accent)]" />
                      </div>
                    )}
                    <p className="px-1 pb-1 pt-0.5 text-center text-[10px] text-[var(--color-muted)]">
                      {design.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {imageMode === "upload" && (
              <div>
                {userImageUrl ? (
                  <div className="relative h-40 overflow-hidden rounded-[1.5rem] border border-[var(--color-line)]">
                    <Image src={userImageUrl} alt="La tua immagine" fill className="object-cover" sizes="400px" unoptimized />
                    <button
                      onClick={() => { setUserImageUrl(null); setImageMode("gallery"); }}
                      className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white"
                    >
                      Rimuovi
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-3 rounded-[1.5rem] border-2 border-dashed border-[var(--color-line)] py-10 transition hover:border-[var(--color-accent)]"
                  >
                    <Upload className="h-8 w-8 text-[var(--color-muted)]" />
                    <p className="text-sm text-[var(--color-muted)]">
                      Clicca per caricare la tua foto
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      JPG, PNG, WEBP — consigliata min. 1500px
                    </p>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </Card>

          {/* Text */}
          <Card className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--color-foreground)]">
                5. Testo personalizzato
                <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </h2>
              <button
                onClick={() => setTextEnabled(!textEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  textEnabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    textEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {textEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-[var(--color-muted)]">Testo</label>
                  <input
                    type="text"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder="es. Per sempre insieme · 2024"
                    maxLength={60}
                    className="w-full rounded-[1rem] border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-[var(--color-muted)]">Font</label>
                    <div className="space-y-2">
                      {FONT_OPTIONS.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setTextFont(f.key)}
                          className={`flex w-full items-center gap-2 rounded-[1rem] border px-3 py-2 text-left text-sm transition ${
                            textFont === f.key
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                              : "border-[var(--color-line)] bg-white/60"
                          }`}
                          style={{ fontFamily: f.fontFamily }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[var(--color-muted)]">Posizione</label>
                    <div className="space-y-2">
                      {TEXT_POSITIONS.map((pos) => (
                        <button
                          key={pos.key}
                          onClick={() => setTextPosition(pos.key)}
                          className={`flex w-full items-center gap-2 rounded-[1rem] border px-3 py-2 text-left text-sm transition ${
                            textPosition === pos.key
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                              : "border-[var(--color-line)] bg-white/60"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[var(--color-muted)]">Colore testo</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-full cursor-pointer rounded-[1rem] border border-[var(--color-line)] bg-white/80 p-1"
                    />
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{textColor}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── Right: preview + summary ───────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Preview */}
          <Card className="overflow-hidden p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Anteprima tela
            </p>
            <div className="flex items-center justify-center rounded-[1.5rem] bg-[var(--color-surface)] p-4">
              <div
                className="relative overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: 300,
                  aspectRatio: `${aspectRatio}`,
                  ...frameStyle(frameType),
                  borderRadius: frameType === "senza" ? "0.5rem" : "0.25rem",
                }}
              >
                <Image
                  src={activeImage}
                  alt="Anteprima tela"
                  fill
                  className="object-cover"
                  sizes="300px"
                  unoptimized
                />
                {/* Text overlay */}
                {textEnabled && textValue && (
                  <div
                    className={`absolute inset-x-0 flex justify-center px-4 ${
                      textPosition === "top"
                        ? "top-3"
                        : textPosition === "center"
                          ? "top-1/2 -translate-y-1/2"
                          : "bottom-3"
                    }`}
                  >
                    <p
                      className="rounded px-2 py-0.5 text-center text-sm font-semibold leading-snug"
                      style={{
                        color: textColor,
                        fontFamily:
                          FONT_OPTIONS.find((f) => f.key === textFont)?.fontFamily ?? "serif",
                        textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                        backgroundColor: "rgba(0,0,0,0.15)",
                      }}
                    >
                      {textValue}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
              {sizeKey === "personalizzata" ? `${customWidth}×${customHeight} cm` : sizeOption.label}
              {" · "}
              {CANVAS_TYPES.find((t) => t.key === canvasType)?.label}
              {frameType !== "senza" && ` · ${FRAME_TYPES.find((f) => f.key === frameType)?.label}`}
            </p>
          </Card>

          {/* Price breakdown */}
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">Riepilogo prezzo</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Tela base</span>
                <span>{euro(breakdown.basePrice)}</span>
              </div>
              {breakdown.sizeAdjustment > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">
                    {canvasType === "premium" ? "Canvas Premium (+20%)" : "Finitura lucida"}
                  </span>
                  <span>+{euro(breakdown.sizeAdjustment)}</span>
                </div>
              )}
              {breakdown.addonsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Cornice</span>
                  <span>+{euro(breakdown.addonsCost)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--color-line)] pt-2 font-semibold">
                <span>Prezzo unitario</span>
                <span className="text-[var(--color-accent)]">{euro(unitPrice)}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-muted)]">Quantità</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] text-sm font-semibold hover:border-[var(--color-accent)]"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] text-sm font-semibold hover:border-[var(--color-accent)]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[1.5rem] bg-[var(--color-surface)] px-5 py-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">Totale</span>
              <span className="font-display text-3xl text-[var(--color-accent)]">
                {euro(breakdown.total)}
              </span>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={imageMode === "upload" && !userImageUrl}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Aggiunto al carrello!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Aggiungi al carrello
                </>
              )}
            </Button>

            {imageMode === "upload" && !userImageUrl && (
              <p className="text-center text-xs text-[var(--color-muted)]">
                Carica la tua foto per procedere
              </p>
            )}

            <div className="space-y-2 rounded-[1.5rem] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-muted)]">
              <p className="flex gap-2"><span>🖨</span><span>Stampa UV ad alta risoluzione</span></p>
              <p className="flex gap-2"><span>⏱</span><span>Pronto in {product.leadTimeDays} giorni lavorativi</span></p>
              <p className="flex gap-2"><span>📦</span><span>Spedizione protetta inclusa</span></p>
            </div>
          </Card>

          <Link href="/catalogo">
            <Button variant="secondary" className="w-full">
              Torna al catalogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
