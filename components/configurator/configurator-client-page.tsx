"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Upload,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useConfiguratorStore } from "@/store/configurator-store";
import { calculateArtisticPricing } from "@/lib/configurator/artistic-pricing";
import { defaultConfiguratorSettings } from "@/lib/data/configurator-settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/field";
import { euro, cn } from "@/lib/utils";
import type {
  ArtisticConfigSelection,
  ArtisticEventKey,
  ConfiguratorSettings,
  CupVariant,
  EventType,
  FormatKey,
  PaletteSizeKey,
  PrintPosition,
  Product,
  ShirtColor,
  ShirtSize,
  ShirtType,
  SizeKey,
  ThemeKey,
} from "@/types";

// ── Static data ───────────────────────────────────────────────────────────────

const FORMATS: Array<{ key: FormatKey; label: string; desc: string; icon: string }> = [
  {
    key: "bomboniera-singola",
    label: "Bomboniera singola",
    desc: "Il pezzo in legno dipinto a mano, con cordino pronto da regalare",
    icon: "🎁",
  },
  {
    key: "set-cesta",
    label: "Set con cesta",
    desc: "Pezzo + confetti + velo coordinato + cesta decorata tutto incluso",
    icon: "🧺",
  },
  {
    key: "decorazione-quadretto",
    label: "Decorazione / Quadretto",
    desc: "Pezzo da appendere o da esporre, senza confetti",
    icon: "🖼️",
  },
  {
    key: "palette",
    label: "Palette in Legno",
    desc: "Tavoletta dipinta a mano, dimensioni maggiori (min 25×25 cm) — ideale come quadro decorativo o regalo importante",
    icon: "🎨",
  },
];

const SIZES: Array<{ key: SizeKey; label: string; desc: string; dim: string }> = [
  { key: "piccola", label: "Piccola", desc: "Ideale per grandi numeri", dim: "~8×8 cm" },
  { key: "media", label: "Media", desc: "La scelta più popolare", dim: "~12×12 cm" },
  { key: "grande", label: "Grande", desc: "Massima presenza scenica", dim: "~18×18 cm" },
];

const PALETTE_SIZES: Array<{ key: PaletteSizeKey; label: string; desc: string; price?: string }> = [
  { key: "25x25", label: "25×25 cm", desc: "Formato quadrato compatto", price: "da €20" },
  { key: "30x30", label: "30×30 cm", desc: "Formato quadrato standard", price: "da €28" },
  { key: "25x35", label: "25×35 cm", desc: "Formato verticale elegante", price: "da €30" },
  { key: "30x40", label: "30×40 cm", desc: "Formato grande, massima presenza", price: "da €45" },
  { key: "personalizzata", label: "Personalizzata", desc: "Min 25 cm per lato", price: "da €35" },
];

const CUP_VARIANTS: Array<{ key: CupVariant; label: string; desc: string; icon: string; img?: string }> = [
  { key: "classica", label: "Tazza Classica", desc: "Ceramica bianca, stampa permanente", icon: "☕" },
  { key: "magica", label: "Tazza Magica", desc: "Il disegno appare con il calore!", icon: "✨" },
  { key: "con-cucchiaio", label: "Con Cucchiaino", desc: "Tazza + cucchiaino coordinato incluso", icon: "🥄" },
];

const SHIRT_TYPES: Array<{ key: ShirtType; label: string; desc: string; icon: string; img?: string }> = [
  { key: "tshirt-manica-corta", label: "T-Shirt Manica Corta", desc: "100% cotone, taglio classico", icon: "👕" },
  { key: "tshirt-manica-lunga", label: "T-Shirt Manica Lunga", desc: "100% cotone, manica lunga", icon: "🧥" },
  { key: "polo", label: "Polo", desc: "Con colletto e bottoni, look elegante", icon: "🎽" },
];

const SHIRT_SIZES: ShirtSize[] = ["S", "M", "L", "XL", "XXL"];

const SHIRT_COLORS: Array<{ key: ShirtColor; label: string; hex: string }> = [
  { key: "bianco", label: "Bianco", hex: "#f5f5f5" },
  { key: "nero", label: "Nero", hex: "#1a1a1a" },
  { key: "grigio", label: "Grigio", hex: "#9e9e9e" },
  { key: "blu-navy", label: "Blu Navy", hex: "#1a2d5a" },
  { key: "rosso", label: "Rosso", hex: "#c62828" },
];

const PRINT_POSITIONS: Array<{ key: PrintPosition; label: string; desc: string }> = [
  { key: "fronte", label: "Fronte", desc: "Stampa sul petto" },
  { key: "retro", label: "Retro", desc: "Stampa sulla schiena" },
  { key: "entrambi", label: "Fronte + Retro", desc: "+€5/pz, stampa su entrambi i lati" },
];

const BOMBONIERE_STEPS = ["Tema", "Evento", "Personalizza", "Formato", "Extra", "Riepilogo"];
const TAZZE_STEPS = ["Variante", "Personalizzazione", "Quantità", "Riepilogo"];
const MAGLIETTE_STEPS = ["Tipo", "Taglia & Colore", "Upload & Qtà", "Riepilogo"];

const REFERENCE_PHOTOS = [
  { src: "/images/products/mickey-nascita.jpeg", alt: "Mickey Mouse nascita" },
  { src: "/images/products/stitch-giovanna.jpeg", alt: "Stitch e Angel" },
  { src: "/images/products/pinocchio-cesta.jpeg", alt: "Pinocchio con cesta" },
  { src: "/images/products/coniglietto-gaia.jpeg", alt: "Coniglietto Gaia" },
  { src: "/images/products/coniglio-pasqua.jpeg", alt: "Coniglio Pasqua" },
  { src: "/images/products/collezione-mista.jpeg", alt: "Collezione mista" },
];

type Category = string;

// ── Draft types ───────────────────────────────────────────────────────────────

type BomboniereDraft = {
  theme?: ThemeKey;
  themeCustomNote: string;
  event?: ArtisticEventKey;
  names: string;
  eventDate: string;
  preferredColors: string[];
  specialNotes: string;
  format?: FormatKey;
  size?: SizeKey;
  paletteSize?: PaletteSizeKey;
  paletteCustomWidth: number;
  paletteCustomHeight: number;
  quantity: number;
  confettiEnabled: boolean;
  confettiFlavor: string;
  confettiColor: string;
  veilEnabled: boolean;
  veilColor: string;
  decoratedBasket: boolean;
  personalizedCard: boolean;
  personalizedCardText: string;
};

type TazzeDraft = {
  variant?: string;
  customText: string;
  logoUrl?: string;
  quantity: number;
};

type MaglietteDraft = {
  shirtType?: string;
  size?: string;
  color?: string;
  printPosition?: string;
  logoUrl?: string;
  customText: string;
  quantity: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toEventType(event: ArtisticEventKey): EventType {
  const map: Record<ArtisticEventKey, EventType> = {
    nascita: "nascita",
    battesimo: "battesimo",
    "primo-compleanno": "nascita",
    comunione: "comunione",
    cresima: "comunione",
    matrimonio: "matrimonio",
    pasqua: "pasqua",
    altro: "battesimo",
  };
  return map[event];
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function ProgressBar({ step, labels }: { step: number; labels: string[] }) {
  const total = labels.length;
  return (
    <div className="relative flex items-start justify-between">
      <div className="absolute left-0 right-0 top-4 h-px bg-[var(--color-line)]" aria-hidden />
      <div
        className="absolute left-0 top-4 h-px bg-[var(--color-accent)] transition-all duration-500"
        style={{ width: total > 1 ? `${((step - 1) / (total - 1)) * 100}%` : "0%" }}
        aria-hidden
      />
      {labels.map((label, index) => {
        const num = index + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="relative flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                done
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : active
                    ? "border-[var(--color-accent)] bg-white text-[var(--color-accent)]"
                    : "border-[var(--color-line)] bg-white text-[var(--color-muted)]",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : num}
            </div>
            <span
              className={cn(
                "hidden text-[10px] font-medium sm:block",
                active ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
        enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          enabled ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-foreground)]">{value}</p>
    </div>
  );
}

export function QuantitySelector({
  value,
  onChange,
  presets,
  min = 1,
  max = 500,
}: {
  value: number;
  onChange: (v: number) => void;
  presets: number[];
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white transition hover:border-[var(--color-accent)]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex min-w-[80px] items-center justify-center rounded-2xl border border-[var(--color-line)] bg-white px-4 py-2">
        <span className="text-lg font-bold text-[var(--color-foreground)]">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white transition hover:border-[var(--color-accent)]"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="flex flex-wrap gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              value === preset
                ? "bg-[var(--color-accent)] text-white"
                : "border border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-accent)]",
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Category Selector ─────────────────────────────────────────────────────────

const CATEGORY_STYLE_MAP: Record<string, { gradient: string; border: string }> = {
  bomboniere: { gradient: "from-rose-50 to-pink-50", border: "hover:border-rose-300" },
  tazze: { gradient: "from-amber-50 to-orange-50", border: "hover:border-amber-300" },
  magliette: { gradient: "from-sky-50 to-blue-50", border: "hover:border-sky-300" },
};

const DEFAULT_CATEGORY_STYLE = {
  gradient: "from-violet-50 to-purple-50",
  border: "hover:border-violet-300",
};

function CategorySelector({
  settings,
  onSelect,
}: {
  settings: ConfiguratorSettings;
  onSelect: (cat: Category) => void;
}) {
  const activeCategories = (settings.categories ?? []).filter((c) => c.active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Cosa vuoi personalizzare?
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Scegli la categoria per iniziare il configuratore.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {activeCategories.map((cat) => {
          const style = CATEGORY_STYLE_MAP[cat.key] ?? DEFAULT_CATEGORY_STYLE;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              className={cn(
                "group flex flex-col items-center gap-5 rounded-[2rem] border border-[var(--color-line)] bg-gradient-to-br p-8 text-center transition-all duration-200 hover:shadow-xl",
                style.gradient,
                style.border,
              )}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-white/50 shadow-sm transition-transform duration-200 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const sibling = (e.target as HTMLImageElement).nextElementSibling;
                    if (sibling) sibling.classList.remove("hidden");
                  }}
                />
              ) : null}
              <span className={cn("text-5xl transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6", cat.image && "hidden")}>
                {cat.icon}
              </span>
              <div>
                <p className="font-display text-2xl text-[var(--color-foreground)]">{cat.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {cat.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)]">
                Inizia
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── BOMBONIERE FLOW ───────────────────────────────────────────────────────────

function BombonieraStep1({
  draft,
  settings,
  onTheme,
  onNote,
}: {
  draft: BomboniereDraft;
  settings: ConfiguratorSettings;
  onTheme: (k: ThemeKey) => void;
  onNote: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Scegli il tema o il personaggio
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Ogni pezzo è dipinto a mano — seleziona il soggetto principale.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {settings.themes.filter((t) => t.active).map((theme) => {
          const active = draft.theme === (theme.key as ThemeKey);
          return (
            <button
              key={theme.key}
              type="button"
              onClick={() => onTheme(theme.key as ThemeKey)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[1.5rem] border text-left transition-all duration-200",
                active
                  ? "border-[var(--color-accent)] shadow-[0_0_0_2px_var(--color-accent)]"
                  : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50",
              )}
            >
              <div className="relative h-28 w-full overflow-hidden bg-[var(--color-surface)]">
                {theme.img && (
                  <Image
                    src={theme.img}
                    alt={theme.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                )}
                {active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent)]/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold leading-tight text-[var(--color-foreground)]">
                  {theme.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[var(--color-muted)]">
                  {theme.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {draft.theme === "personalizzato" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-foreground)]">
            Descrivi il tuo tema personalizzato
          </label>
          <Textarea
            value={draft.themeCustomNote}
            onChange={(e) => onNote(e.target.value)}
            placeholder="Es. Personaggio dei Paw Patrol, una principessa con castelli..."
            maxLength={300}
          />
          <p className="text-xs text-[var(--color-muted)]">{draft.themeCustomNote.length}/300 caratteri</p>
        </div>
      )}
    </div>
  );
}

function BombonieraStep2({
  draft,
  settings,
  onEvent,
}: {
  draft: BomboniereDraft;
  settings: ConfiguratorSettings;
  onEvent: (k: ArtisticEventKey) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Per quale occasione?
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Il tema grafico e i dettagli saranno adattati al tuo evento.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {settings.events.filter((e) => e.active).map((ev) => {
          const active = draft.event === (ev.key as ArtisticEventKey);
          return (
            <button
              key={ev.key}
              type="button"
              onClick={() => onEvent(ev.key as ArtisticEventKey)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[1.5rem] border px-4 py-5 text-center transition-all duration-200",
                active
                  ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.06)] shadow-sm"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50",
              )}
            >
              <span className="text-3xl">{ev.icon}</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                )}
              >
                {ev.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BombonieraStep3({
  draft,
  settings,
  onNames,
  onDate,
  onToggleColor,
  onNotes,
}: {
  draft: BomboniereDraft;
  settings: ConfiguratorSettings;
  onNames: (v: string) => void;
  onDate: (v: string) => void;
  onToggleColor: (hex: string) => void;
  onNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Personalizza il tuo pezzo
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Inserisci il nome da dipingere e i dettagli del tuo evento.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          Nome/i del protagonista <span className="text-[var(--color-accent)]">*</span>
        </label>
        <Input
          value={draft.names}
          onChange={(e) => onNames(e.target.value)}
          placeholder="Es. Sofia • Lorenzo e Giulia"
          maxLength={80}
        />
        <p className="text-xs text-[var(--color-muted)]">
          Puoi inserire più nomi separati da • o virgola
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          Data dell&apos;evento{" "}
          <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
        </label>
        <Input
          type="date"
          value={draft.eventDate}
          onChange={(e) => onDate(e.target.value)}
        />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Colori preferiti{" "}
            <span className="text-xs font-normal text-[var(--color-muted)]">(max 4, opzionale)</span>
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Guida la nostra pittrice nella scelta della palette
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.paletteColors.map((color) => {
            const selected = draft.preferredColors.includes(color.hex);
            return (
              <button
                key={color.hex}
                type="button"
                title={color.label}
                onClick={() => onToggleColor(color.hex)}
                className={cn(
                  "relative h-9 w-9 rounded-full border-2 transition-all duration-150",
                  selected
                    ? "border-[var(--color-accent)] shadow-[0_0_0_2px_var(--color-accent)]"
                    : "border-[var(--color-line)] hover:scale-110",
                )}
                style={{ backgroundColor: color.hex }}
              >
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check
                      className="h-4 w-4"
                      style={{ color: color.hex === "#ffffff" ? "#bf4f7b" : "white" }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {draft.preferredColors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-muted)]">Selezionati:</span>
            {draft.preferredColors.map((hex) => {
              const c = settings.paletteColors.find((p) => p.hex === hex);
              return (
                <span
                  key={hex}
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: hex === "#ffffff" ? "#bf4f7b" : hex }}
                >
                  {c?.label ?? hex}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          Note speciali{" "}
          <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
        </label>
        <Textarea
          value={draft.specialNotes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="Es. Aggiungi un cuoricino vicino al nome, usa tonalità pastello..."
          maxLength={400}
        />
        <p className="text-xs text-[var(--color-muted)]">{draft.specialNotes.length}/400 caratteri</p>
      </div>
    </div>
  );
}

function BombonieraStep4({
  draft,
  onFormat,
  onSize,
  onPaletteSize,
  onPaletteCustomWidth,
  onPaletteCustomHeight,
  onQuantity,
}: {
  draft: BomboniereDraft;
  onFormat: (k: FormatKey) => void;
  onSize: (k: SizeKey) => void;
  onPaletteSize: (k: PaletteSizeKey) => void;
  onPaletteCustomWidth: (v: number) => void;
  onPaletteCustomHeight: (v: number) => void;
  onQuantity: (v: number) => void;
}) {
  const isPalette = draft.format === "palette";
  const qtyPresets = isPalette ? [1, 2, 3, 5] : [10, 20, 50, 100];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Formato e dimensione
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Scegli come vuoi ricevere le tue bomboniere e quante ne servono.
        </p>
      </div>

      {/* Format selection */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          Formato <span className="text-[var(--color-accent)]">*</span>
        </p>
        <div className="grid gap-3">
          {FORMATS.map((fmt) => {
            const active = draft.format === fmt.key;
            return (
              <button
                key={fmt.key}
                type="button"
                onClick={() => onFormat(fmt.key)}
                className={cn(
                  "flex items-start gap-4 rounded-[1.5rem] border px-5 py-4 text-left transition-all duration-200",
                  active
                    ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)] shadow-sm"
                    : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                )}
              >
                <span className="mt-0.5 text-2xl">{fmt.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[var(--color-foreground)]">{fmt.label}</p>
                    {active && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)]">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    {fmt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selection — standard (not palette) */}
      {!isPalette && draft.format && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Dimensione <span className="text-[var(--color-accent)]">*</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map((sz) => {
              const active = draft.size === sz.key;
              return (
                <button
                  key={sz.key}
                  type="button"
                  onClick={() => onSize(sz.key)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[1.5rem] border px-3 py-4 text-center transition-all duration-200",
                    active
                      ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)] shadow-sm"
                      : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                  )}
                >
                  <p
                    className={cn(
                      "font-semibold",
                      active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                    )}
                  >
                    {sz.label}
                  </p>
                  <p className="text-xs font-medium text-[var(--color-foreground)]">{sz.dim}</p>
                  <p className="text-xs text-[var(--color-muted)]">{sz.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Palette size selection */}
      {isPalette && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Misura della palette <span className="text-[var(--color-accent)]">*</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PALETTE_SIZES.map((ps) => {
              const active = draft.paletteSize === ps.key;
              return (
                <button
                  key={ps.key}
                  type="button"
                  onClick={() => onPaletteSize(ps.key)}
                  className={cn(
                    "flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-left transition-all duration-200",
                    active
                      ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)] shadow-sm"
                      : "border-[var(--color-line)] hover:border-[var(--color-accent)]/40",
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                      )}
                    >
                      {ps.label}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">{ps.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ps.price && (
                      <span className="rounded-full bg-[rgba(191,79,123,0.08)] px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
                        {ps.price}
                      </span>
                    )}
                    {active && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)]">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom dimensions for "personalizzata" */}
          {draft.paletteSize === "personalizzata" && (
            <div className="mt-3 grid gap-3 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  Larghezza (cm) <span className="text-[var(--color-accent)]">*</span>
                </label>
                <input
                  type="number"
                  min={25}
                  max={100}
                  value={draft.paletteCustomWidth}
                  onChange={(e) => onPaletteCustomWidth(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  Altezza (cm) <span className="text-[var(--color-accent)]">*</span>
                </label>
                <input
                  type="number"
                  min={25}
                  max={100}
                  value={draft.paletteCustomHeight}
                  onChange={(e) => onPaletteCustomHeight(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                />
              </div>
              <p className="text-xs text-[var(--color-muted)] sm:col-span-2">
                Dimensioni minime 25×25 cm. Il prezzo sarà calcolato in base alle misure.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-foreground)]">Quantità</p>
        <QuantitySelector
          value={draft.quantity}
          onChange={onQuantity}
          presets={qtyPresets}
          min={1}
          max={isPalette ? 20 : 500}
        />
      </div>
    </div>
  );
}

function BombonieraStep5({
  draft,
  settings,
  onUpdate,
}: {
  draft: BomboniereDraft;
  settings: ConfiguratorSettings;
  onUpdate: <K extends keyof BomboniereDraft>(key: K, value: BomboniereDraft[K]) => void;
}) {
  const isPalette = draft.format === "palette";

  if (isPalette) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-3xl text-[var(--color-foreground)]">
            Extra e personalizzazioni
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Per le Palette in Legno è disponibile solo il bigliettino personalizzato.
          </p>
        </div>
        <Card className={cn("space-y-4 transition-all", draft.personalizedCard && "ring-1 ring-[var(--color-accent)]")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">💌 Bigliettino personalizzato</p>
              <p className="text-sm text-[var(--color-muted)]">+{euro(settings.cardPrice)} per pezzo</p>
            </div>
            <ToggleSwitch
              enabled={draft.personalizedCard}
              onChange={(v) => onUpdate("personalizedCard", v)}
            />
          </div>
          {draft.personalizedCard && (
            <div className="border-t border-[var(--color-line)] pt-4">
              <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">
                Testo del bigliettino{" "}
                <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </p>
              <Textarea
                value={draft.personalizedCardText}
                onChange={(e) => onUpdate("personalizedCardText", e.target.value)}
                placeholder="Es. Con affetto per il tuo giorno speciale..."
                maxLength={200}
              />
            </div>
          )}
        </Card>
        <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
          🎨 Le Palette in Legno sono pezzi unici dipinti a mano — non includono confetti o veli.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Extra e personalizzazioni
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Tutti gli extra sono facoltativi. Ogni aggiunta è coordinata al tuo tema.
        </p>
      </div>

      {/* Confetti */}
      <Card className={cn("space-y-4 transition-all", draft.confettiEnabled && "ring-1 ring-[var(--color-accent)]")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">🍬 Confetti coordinati</p>
            <p className="text-sm text-[var(--color-muted)]">+{euro(settings.confettiPrice)} per pezzo</p>
          </div>
          <ToggleSwitch enabled={draft.confettiEnabled} onChange={(v) => onUpdate("confettiEnabled", v)} />
        </div>
        {draft.confettiEnabled && (
          <div className="space-y-3 border-t border-[var(--color-line)] pt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-foreground)]">Gusto</p>
              <div className="flex flex-wrap gap-2">
                {settings.confettiFlavors.filter(Boolean).map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => onUpdate("confettiFlavor", flavor)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      draft.confettiFlavor === flavor
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]",
                    )}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-foreground)]">Colore</p>
              <div className="flex flex-wrap gap-2">
                {settings.confettiColors.filter(Boolean).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate("confettiColor", color)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      draft.confettiColor === color
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]",
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Velo */}
      <Card className={cn("space-y-4 transition-all", draft.veilEnabled && "ring-1 ring-[var(--color-accent)]")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">🎀 Velo coordinato</p>
            <p className="text-sm text-[var(--color-muted)]">+{euro(settings.veilPrice)} per pezzo</p>
          </div>
          <ToggleSwitch enabled={draft.veilEnabled} onChange={(v) => onUpdate("veilEnabled", v)} />
        </div>
        {draft.veilEnabled && (
          <div className="border-t border-[var(--color-line)] pt-4">
            <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">Colore velo</p>
            <div className="flex flex-wrap gap-2">
              {settings.veilColors.filter(Boolean).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onUpdate("veilColor", color)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    draft.veilColor === color
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]",
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Cesta */}
      <Card className={cn("transition-all", draft.decoratedBasket && "ring-1 ring-[var(--color-accent)]")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">🧺 Cesta decorata</p>
            <p className="text-sm text-[var(--color-muted)]">
              +{euro(settings.basketPrice)} per pezzo · con fodera e decorazione a tema
            </p>
          </div>
          <ToggleSwitch enabled={draft.decoratedBasket} onChange={(v) => onUpdate("decoratedBasket", v)} />
        </div>
      </Card>

      {/* Bigliettino */}
      <Card className={cn("space-y-4 transition-all", draft.personalizedCard && "ring-1 ring-[var(--color-accent)]")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">💌 Bigliettino personalizzato</p>
            <p className="text-sm text-[var(--color-muted)]">+{euro(settings.cardPrice)} per pezzo</p>
          </div>
          <ToggleSwitch enabled={draft.personalizedCard} onChange={(v) => onUpdate("personalizedCard", v)} />
        </div>
        {draft.personalizedCard && (
          <div className="border-t border-[var(--color-line)] pt-4">
            <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">
              Testo del bigliettino{" "}
              <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
            </p>
            <Textarea
              value={draft.personalizedCardText}
              onChange={(e) => onUpdate("personalizedCardText", e.target.value)}
              placeholder="Es. Con affetto per il tuo giorno speciale..."
              maxLength={200}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function BombonieraStep6({
  draft,
  settings,
  onAddToCart,
}: {
  draft: BomboniereDraft;
  settings: ConfiguratorSettings;
  onAddToCart: () => void;
}) {
  const isPalette = draft.format === "palette";

  const pricing = calculateArtisticPricing(
    {
      format: draft.format!,
      size: draft.size,
      paletteSize: draft.paletteSize,
      quantity: draft.quantity,
      confettiEnabled: draft.confettiEnabled,
      veilEnabled: draft.veilEnabled,
      decoratedBasket: draft.decoratedBasket,
      personalizedCard: draft.personalizedCard,
    },
    {
      basePrices: settings.basePrices,
      confettiPrice: settings.confettiPrice,
      veilPrice: settings.veilPrice,
      basketPrice: settings.basketPrice,
      cardPrice: settings.cardPrice,
    },
  );

  const theme = settings.themes.find((t) => t.key === draft.theme);
  const event = settings.events.find((e) => e.key === draft.event);
  const format = FORMATS.find((f) => f.key === draft.format);
  const size = SIZES.find((s) => s.key === draft.size);
  const paletteSize = PALETTE_SIZES.find((p) => p.key === draft.paletteSize);

  const addons: string[] = [];
  if (draft.confettiEnabled) addons.push(`Confetti ${draft.confettiFlavor} – ${draft.confettiColor}`);
  if (draft.veilEnabled) addons.push(`Velo ${draft.veilColor}`);
  if (draft.decoratedBasket) addons.push("Cesta decorata");
  if (draft.personalizedCard) addons.push("Bigliettino personalizzato");

  const dimensioneLabel = isPalette
    ? draft.paletteSize === "personalizzata"
      ? `Personalizzata (${draft.paletteCustomWidth}×${draft.paletteCustomHeight} cm)`
      : paletteSize?.label ?? ""
    : size
      ? `${size.label} (${size.dim})`
      : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Riepilogo ordine
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Controlla i dettagli prima di aggiungere al carrello.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryRow label="Tema" value={theme?.label ?? ""} />
          <SummaryRow label="Evento" value={`${event?.icon ?? ""} ${event?.label ?? ""}`} />
          <SummaryRow label="Nome/i" value={draft.names} />
          {draft.eventDate && <SummaryRow label="Data evento" value={draft.eventDate} />}
          <SummaryRow label="Formato" value={format?.label ?? ""} />
          <SummaryRow label="Dimensione" value={dimensioneLabel} />
          <SummaryRow label="Quantità" value={`${draft.quantity} ${isPalette ? "pezzi" : "pezzi"}`} />
          {draft.preferredColors.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--color-muted)]">Colori preferiti</p>
              <div className="flex gap-1.5">
                {draft.preferredColors.map((hex) => (
                  <div
                    key={hex}
                    className="h-5 w-5 rounded-full border border-[var(--color-line)]"
                    style={{ backgroundColor: hex }}
                    title={settings.paletteColors.find((p) => p.hex === hex)?.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {addons.length > 0 && (
          <div className="border-t border-[var(--color-line)] pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Extra inclusi
            </p>
            <div className="flex flex-wrap gap-2">
              {addons.map((addon) => (
                <span
                  key={addon}
                  className="rounded-full bg-[rgba(191,79,123,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
                >
                  {addon}
                </span>
              ))}
            </div>
          </div>
        )}
        {draft.specialNotes && (
          <div className="border-t border-[var(--color-line)] pt-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Note speciali
            </p>
            <p className="text-sm italic leading-relaxed text-[var(--color-foreground)]">
              &ldquo;{draft.specialNotes}&rdquo;
            </p>
          </div>
        )}
      </Card>

      <Card className="space-y-3 bg-gradient-to-br from-white to-[rgba(191,79,123,0.04)]">
        <p className="font-semibold text-[var(--color-foreground)]">Stima del prezzo</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Prezzo unitario (base)</span>
            <span className="font-medium">{euro(pricing.breakdown.basePrice)}/pz</span>
          </div>
          {pricing.breakdown.addonsCost > 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Extra per pezzo</span>
              <span className="font-medium">+{euro(pricing.breakdown.addonsCost)}/pz</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Quantità</span>
            <span className="font-medium">× {draft.quantity}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-2">
            <span className="font-bold text-[var(--color-foreground)]">Totale stimato</span>
            <span className="text-2xl font-bold text-[var(--color-accent)]">
              {euro(pricing.totalPrice)}
            </span>
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)]">* {settings.summaryMessage}</p>
      </Card>

      <div className="space-y-3">
        <p className="font-semibold text-[var(--color-foreground)]">Lavori simili già realizzati</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {REFERENCE_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square overflow-hidden rounded-[1rem] border border-[var(--color-line)]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full gap-2" size="lg" onClick={onAddToCart}>
        <ShoppingBag className="h-4 w-4" />
        Aggiungi al carrello
      </Button>

      <p className="text-center text-xs text-[var(--color-muted)]">
        {settings.productionTimeNote}
      </p>
    </div>
  );
}

// ── Bomboniere Flow Container ─────────────────────────────────────────────────

function BomboniereFlow({
  settings,
  onBack,
}: {
  settings: ConfiguratorSettings;
  onBack: () => void;
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BomboniereDraft>({
    themeCustomNote: "",
    names: "",
    eventDate: "",
    preferredColors: [],
    specialNotes: "",
    quantity: 20,
    confettiEnabled: false,
    confettiFlavor: settings.confettiFlavors[0] ?? "",
    confettiColor: settings.confettiColors[0] ?? "",
    veilEnabled: false,
    veilColor: settings.veilColors[0] ?? "",
    decoratedBasket: false,
    personalizedCard: false,
    personalizedCardText: "",
    paletteCustomWidth: 25,
    paletteCustomHeight: 25,
  });

  function update<K extends keyof BomboniereDraft>(key: K, value: BomboniereDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleColor(hex: string) {
    setDraft((d) => {
      const colors = d.preferredColors;
      return {
        ...d,
        preferredColors: colors.includes(hex)
          ? colors.filter((c) => c !== hex)
          : colors.length < 4
            ? [...colors, hex]
            : colors,
      };
    });
  }

  function canProceed(): boolean {
    if (step === 1) return !!draft.theme;
    if (step === 2) return !!draft.event;
    if (step === 3) return draft.names.trim().length > 0;
    if (step === 4) {
      if (!draft.format) return false;
      if (draft.format === "palette") {
        if (!draft.paletteSize) return false;
        if (
          draft.paletteSize === "personalizzata" &&
          (draft.paletteCustomWidth < 25 || draft.paletteCustomHeight < 25)
        )
          return false;
        return true;
      }
      return !!draft.size;
    }
    if (step === 5) return true;
    return false;
  }

  function handleAddToCart() {
    const config: ArtisticConfigSelection = {
      theme: draft.theme!,
      themeCustomNote: draft.themeCustomNote || undefined,
      event: draft.event!,
      names: draft.names.trim(),
      eventDate: draft.eventDate || undefined,
      preferredColors: draft.preferredColors,
      specialNotes: draft.specialNotes || undefined,
      format: draft.format!,
      size: draft.format !== "palette" ? draft.size : undefined,
      paletteSize: draft.format === "palette" ? draft.paletteSize : undefined,
      paletteCustomNote:
        draft.format === "palette" && draft.paletteSize === "personalizzata"
          ? `${draft.paletteCustomWidth}×${draft.paletteCustomHeight} cm`
          : undefined,
      confettiEnabled: draft.confettiEnabled,
      confettiFlavor: draft.confettiEnabled ? draft.confettiFlavor : undefined,
      confettiColor: draft.confettiEnabled ? draft.confettiColor : undefined,
      veilEnabled: draft.veilEnabled,
      veilColor: draft.veilEnabled ? draft.veilColor : undefined,
      decoratedBasket: draft.decoratedBasket,
      personalizedCard: draft.personalizedCard,
      personalizedCardText: draft.personalizedCard ? draft.personalizedCardText : undefined,
      quantity: draft.quantity,
    };

    const { unitPrice, totalPrice, breakdown } = calculateArtisticPricing(config, {
      basePrices: settings.basePrices,
      confettiPrice: settings.confettiPrice,
      veilPrice: settings.veilPrice,
      basketPrice: settings.basketPrice,
      cardPrice: settings.cardPrice,
    });

    const themeData = settings.themes.find((t) => t.key === config.theme);
    const eventInfo = settings.events.find((e) => e.key === config.event);

    const product: Product = {
      id: `custom-${config.theme}-${config.event}-${Date.now()}`,
      slug: config.format === "palette" ? "palette-personalizzata" : `configurato-${config.theme}`,
      name:
        config.format === "palette"
          ? `Palette in Legno – ${themeData?.label ?? config.theme}`
          : `${themeData?.label ?? config.theme} – ${eventInfo?.label ?? config.event}`,
      shortDescription:
        config.format === "palette"
          ? `Palette dipinta a mano per ${config.names}`
          : `Pezzo artigianale personalizzato per ${config.names}`,
      description: "",
      category: "bomboniere",
      eventType: toEventType(config.event),
      basePrice: unitPrice,
      isFeatured: false,
      isActive: true,
      isCustomizable: true,
      inspirationType: "both",
      defaultShape: "cuore",
      supportedShapes: ["cuore"],
      materials:
        config.format === "palette"
          ? ["Legno dipinto a mano", "Palette"]
          : ["Legno dipinto a mano"],
      productionNotes: config.specialNotes ?? "",
      leadTimeDays: config.format === "palette" ? 21 : 14,
      badge: config.format === "palette" ? "Palette Artigianale" : "Personalizzato",
      palette: config.preferredColors,
      images: [
        {
          id: "preview",
          url: themeData?.img ?? "/images/logo.jpeg",
          alt: themeData?.label ?? config.theme,
          isCover: true,
        },
      ],
    };

    addItem({ product, quantity: config.quantity, unitPrice, totalPrice, breakdown, configuration: config });
    useConfiguratorStore.getState().clearDrafts();
    router.push("/carrello");
  }

  return (
    <>
      <ProgressBar step={step} labels={BOMBONIERE_STEPS} />
      <div className="mt-10">
        {step === 1 && (
          <BombonieraStep1
            draft={draft}
            settings={settings}
            onTheme={(k) => update("theme", k)}
            onNote={(v) => update("themeCustomNote", v)}
          />
        )}
        {step === 2 && (
          <BombonieraStep2
            draft={draft}
            settings={settings}
            onEvent={(k) => update("event", k)}
          />
        )}
        {step === 3 && (
          <BombonieraStep3
            draft={draft}
            settings={settings}
            onNames={(v) => update("names", v)}
            onDate={(v) => update("eventDate", v)}
            onToggleColor={toggleColor}
            onNotes={(v) => update("specialNotes", v)}
          />
        )}
        {step === 4 && (
          <BombonieraStep4
            draft={draft}
            onFormat={(k) => {
              update("format", k);
              // Reset sizes when format changes
              update("size", undefined);
              update("paletteSize", undefined);
              // Adjust quantity for palette
              if (k === "palette") update("quantity", 1);
              else if (draft.quantity < 10) update("quantity", 20);
            }}
            onSize={(k) => update("size", k)}
            onPaletteSize={(k) => update("paletteSize", k)}
            onPaletteCustomWidth={(v) => update("paletteCustomWidth", v)}
            onPaletteCustomHeight={(v) => update("paletteCustomHeight", v)}
            onQuantity={(v) => update("quantity", v)}
          />
        )}
        {step === 5 && <BombonieraStep5 draft={draft} settings={settings} onUpdate={update} />}
        {step === 6 && (
          <BombonieraStep6 draft={draft} settings={settings} onAddToCart={handleAddToCart} />
        )}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (step === 1) onBack();
            else setStep((s) => s - 1);
          }}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {step === 1 ? "Categorie" : "Indietro"}
        </Button>
        {step < 6 && (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            {step === 5 ? "Vedi riepilogo" : "Avanti"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}

// ── TAZZE FLOW ────────────────────────────────────────────────────────────────

function TazzeFlow({
  settings,
  onBack,
}: {
  settings: ConfiguratorSettings;
  onBack: () => void;
}) {
  const router = useRouter();
  const addProductWithOptions = useCartStore((s) => s.addProductWithOptions);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<TazzeDraft>({
    customText: "",
    quantity: 1,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof TazzeDraft>(key: K, value: TazzeDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update("logoUrl", url);
  }

  function canProceed(): boolean {
    if (step === 1) return !!draft.variant;
    if (step === 2) return true; // text and logo are optional
    if (step === 3) return draft.quantity >= 1;
    return false;
  }

  // Derive active cup variants from settings (with fallback to static)
  const activeCupVariants = (() => {
    const fromSettings = settings.categorySettings?.tazze?.variants;
    if (fromSettings && fromSettings.length > 0) {
      return fromSettings.filter((v) => v.active).map((v) => ({
        key: v.key,
        label: v.label || CUP_VARIANTS.find((cv) => cv.key === v.key)?.label || v.key,
        desc: v.desc || CUP_VARIANTS.find((cv) => cv.key === v.key)?.desc || "",
        icon: CUP_VARIANTS.find((cv) => cv.key === v.key)?.icon ?? "☕",
        img: v.img || CUP_VARIANTS.find((cv) => cv.key === v.key)?.img || "",
        price: v.price,
      }));
    }
    return CUP_VARIANTS.map((v) => ({
      key: v.key,
      label: v.label,
      desc: v.desc,
      icon: v.icon,
      img: v.img || "",
      price: settings.tazzePrices[v.key as keyof typeof settings.tazzePrices] ?? 12,
    }));
  })();

  function getUnitPrice(): number {
    if (!draft.variant) return 0;
    const v = activeCupVariants.find((cv) => cv.key === draft.variant);
    if (v) return v.price;
    return settings.tazzePrices[draft.variant as keyof typeof settings.tazzePrices] ?? 12;
  }

  function handleAddToCart() {
    const variantLabel = activeCupVariants.find((v) => v.key === draft.variant)?.label ?? "Tazza";
    const unitPrice = getUnitPrice();

    const product: Product = {
      id: `tazza-${draft.variant}-${Date.now()}`,
      slug: "tazza-personalizzata",
      name: `${variantLabel} personalizzata`,
      shortDescription: draft.customText
        ? `Con testo: "${draft.customText}"`
        : "Tazza con logo personalizzato",
      description: "",
      category: "tazze",
      eventType: "battesimo",
      basePrice: unitPrice,
      isFeatured: false,
      isActive: true,
      isCustomizable: true,
      inspirationType: "product",
      defaultShape: "rettangolo",
      supportedShapes: ["rettangolo"],
      materials: ["Ceramica", "Stampa sublimatica"],
      productionNotes: "",
      leadTimeDays: 7,
      badge: "Personalizzata",
      palette: [],
      images: [
        {
          id: "preview",
          url: draft.logoUrl ?? "/images/logo.jpeg",
          alt: variantLabel,
          isCover: true,
        },
      ],
    };

    addProductWithOptions(product, {
      cupVariant: draft.variant,
      customText: draft.customText || undefined,
      logoUrl: draft.logoUrl,
      quantity: draft.quantity,
    });
    router.push("/carrello");
  }

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * draft.quantity;

  return (
    <>
      <ProgressBar step={step} labels={TAZZE_STEPS} />
      <div className="mt-10">
        {/* Step 1: Variante */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Scegli la variante
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Seleziona il tipo di tazza che preferisci.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {activeCupVariants.map((v) => {
                const active = draft.variant === v.key;
                const price = v.price;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => update("variant", v.key)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-[2rem] border p-6 text-center transition-all duration-200",
                      active
                        ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.06)] shadow-sm"
                        : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50",
                    )}
                  >
                    {v.img ? (
                      <img
                        src={v.img}
                        alt={v.label}
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-white/50"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-4xl">{v.icon}</span>
                    )}
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                        )}
                      >
                        {v.label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{v.desc}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(191,79,123,0.08)] px-3 py-1 text-sm font-bold text-[var(--color-accent)]">
                      {euro(price)}/pz
                    </span>
                    {active && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)]">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Personalizzazione */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Personalizzazione
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Aggiungi un testo e/o carica il tuo logo o immagine.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Testo personalizzato{" "}
                <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </label>
              <Input
                value={draft.customText}
                onChange={(e) => update("customText", e.target.value)}
                placeholder="Es. Buon compleanno Sofia! • La tua citazione preferita..."
                maxLength={80}
              />
              <p className="text-xs text-[var(--color-muted)]">{draft.customText.length}/80 caratteri</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Logo o immagine{" "}
                <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {draft.logoUrl ? (
                <div className="relative inline-block">
                  <div className="relative h-32 w-32 overflow-hidden rounded-[1.5rem] border border-[var(--color-line)]">
                    <Image src={draft.logoUrl} alt="Logo" fill className="object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => update("logoUrl", undefined)}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-line)] text-[var(--color-muted)] hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <Upload className="h-5 w-5" />
                  Carica il tuo logo o immagine (JPG, PNG, SVG)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Quantità */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Quantità
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Quante tazze vuoi ordinare?
              </p>
            </div>
            <QuantitySelector
              value={draft.quantity}
              onChange={(v) => update("quantity", v)}
              presets={[1, 5, 10, 20]}
              min={1}
              max={200}
            />
            {draft.variant && (
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted)]">
                    {euro(unitPrice)}/pz × {draft.quantity}
                  </span>
                  <span className="text-xl font-bold text-[var(--color-accent)]">
                    {euro(totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Riepilogo */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Riepilogo ordine
              </h2>
            </div>
            <Card className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryRow
                  label="Variante"
                  value={activeCupVariants.find((v) => v.key === draft.variant)?.label ?? ""}
                />
                {draft.customText && <SummaryRow label="Testo" value={draft.customText} />}
                <SummaryRow label="Logo" value={draft.logoUrl ? "Immagine allegata" : "Nessun logo"} />
                <SummaryRow label="Quantità" value={`${draft.quantity} pezzi`} />
              </div>
            </Card>
            <Card className="space-y-3 bg-gradient-to-br from-white to-[rgba(191,79,123,0.04)]">
              <p className="font-semibold text-[var(--color-foreground)]">Stima del prezzo</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Prezzo unitario</span>
                  <span className="font-medium">{euro(unitPrice)}/pz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Quantità</span>
                  <span className="font-medium">× {draft.quantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-2">
                  <span className="font-bold text-[var(--color-foreground)]">Totale stimato</span>
                  <span className="text-2xl font-bold text-[var(--color-accent)]">
                    {euro(totalPrice)}
                  </span>
                </div>
              </div>
            </Card>
            <Button className="w-full gap-2" size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" />
              Aggiungi al carrello
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (step === 1) onBack();
            else setStep((s) => s - 1);
          }}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {step === 1 ? "Categorie" : "Indietro"}
        </Button>
        {step < 4 && (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            {step === 3 ? "Vedi riepilogo" : "Avanti"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}

// ── MAGLIETTE FLOW ────────────────────────────────────────────────────────────

function MaglietteFlow({
  settings,
  onBack,
}: {
  settings: ConfiguratorSettings;
  onBack: () => void;
}) {
  const router = useRouter();
  const addProductWithOptions = useCartStore((s) => s.addProductWithOptions);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<MaglietteDraft>({
    customText: "",
    quantity: 1,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof MaglietteDraft>(key: K, value: MaglietteDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update("logoUrl", url);
  }

  function canProceed(): boolean {
    if (step === 1) return !!draft.shirtType;
    if (step === 2) return !!draft.size && !!draft.color && !!draft.printPosition;
    if (step === 3) return draft.quantity >= 1;
    return false;
  }

  // Derive active shirt types from settings (with fallback to static)
  const activeShirtTypes = (() => {
    const fromSettings = settings.categorySettings?.magliette?.variants;
    if (fromSettings && fromSettings.length > 0) {
      return fromSettings.filter((v) => v.active).map((v) => ({
        key: v.key,
        label: v.label || SHIRT_TYPES.find((st) => st.key === v.key)?.label || v.key,
        desc: v.desc || SHIRT_TYPES.find((st) => st.key === v.key)?.desc || "",
        icon: SHIRT_TYPES.find((st) => st.key === v.key)?.icon ?? "👕",
        img: v.img || SHIRT_TYPES.find((st) => st.key === v.key)?.img || "",
        price: v.price,
      }));
    }
    return SHIRT_TYPES.map((v) => ({
      key: v.key,
      label: v.label,
      desc: v.desc,
      icon: v.icon,
      img: v.img || "",
      price: settings.magliettePrices[v.key as keyof typeof settings.magliettePrices] ?? 15,
    }));
  })();

  // Derive active shirt colors from settings (with fallback to static)
  const activeShirtColors = (() => {
    const fromSettings = settings.categorySettings?.magliette?.colors;
    if (fromSettings && fromSettings.length > 0) {
      return fromSettings.filter((c) => c.active).map((c) => ({
        key: c.key,
        label: c.label,
        hex: c.hex,
      }));
    }
    return SHIRT_COLORS as Array<{ key: string; label: string; hex: string }>;
  })();

  function getUnitPrice(): number {
    if (!draft.shirtType) return 0;
    const v = activeShirtTypes.find((t) => t.key === draft.shirtType);
    let base = v?.price ?? settings.magliettePrices[draft.shirtType as keyof typeof settings.magliettePrices] ?? 15;
    if (draft.printPosition === "entrambi") {
      base += settings.magliettePrices.printBothSidesSurcharge ?? 5;
    }
    return base;
  }

  function handleAddToCart() {
    const typeLabel = activeShirtTypes.find((t) => t.key === draft.shirtType)?.label ?? "Maglietta";
    const unitPrice = getUnitPrice();

    const product: Product = {
      id: `maglietta-${draft.shirtType}-${Date.now()}`,
      slug: "maglietta-personalizzata",
      name: `${typeLabel} personalizzata`,
      shortDescription: `Taglia ${draft.size ?? ""} – ${activeShirtColors.find((c) => c.key === draft.color)?.label ?? ""}`,
      description: "",
      category: "magliette",
      eventType: "battesimo",
      basePrice: unitPrice,
      isFeatured: false,
      isActive: true,
      isCustomizable: true,
      inspirationType: "product",
      defaultShape: "rettangolo",
      supportedShapes: ["rettangolo"],
      materials: ["Cotone", "Stampa serigrafica"],
      productionNotes: "",
      leadTimeDays: 10,
      badge: "Personalizzata",
      palette: [],
      images: [
        {
          id: "preview",
          url: draft.logoUrl ?? "/images/logo.jpeg",
          alt: typeLabel,
          isCover: true,
        },
      ],
    };

    addProductWithOptions(product, {
      shirtType: draft.shirtType,
      size: draft.size,
      color: draft.color,
      printPosition: draft.printPosition,
      logoUrl: draft.logoUrl,
      customText: draft.customText || undefined,
      quantity: draft.quantity,
    });
    router.push("/carrello");
  }

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * draft.quantity;

  return (
    <>
      <ProgressBar step={step} labels={MAGLIETTE_STEPS} />
      <div className="mt-10">
        {/* Step 1: Tipo */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Scegli il tipo di maglietta
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Seleziona il modello da personalizzare.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {activeShirtTypes.map((t) => {
                const active = draft.shirtType === t.key;
                const price = t.price;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => update("shirtType", t.key)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-[2rem] border p-6 text-center transition-all duration-200",
                      active
                        ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.06)] shadow-sm"
                        : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50",
                    )}
                  >
                    {t.img ? (
                      <img
                        src={t.img}
                        alt={t.label}
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-white/50"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-4xl">{t.icon}</span>
                    )}
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                        )}
                      >
                        {t.label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{t.desc}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(191,79,123,0.08)] px-3 py-1 text-sm font-bold text-[var(--color-accent)]">
                      da {euro(price)}/pz
                    </span>
                    {active && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)]">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Taglia + Colore + Posizione stampa */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Taglia, colore e stampa
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Configura le opzioni della tua maglietta.
              </p>
            </div>

            {/* Taglia */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Taglia <span className="text-[var(--color-accent)]">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {SHIRT_SIZES.map((sz) => {
                  const active = draft.size === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update("size", sz)}
                      className={cn(
                        "h-12 w-12 rounded-2xl border text-sm font-bold transition-all duration-150",
                        active
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-sm"
                          : "border-[var(--color-line)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]",
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colore base */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Colore base <span className="text-[var(--color-accent)]">*</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {activeShirtColors.map((c) => {
                  const active = draft.color === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      title={c.label}
                      onClick={() => update("color", c.key)}
                      className={cn(
                        "relative h-10 w-10 rounded-full border-2 transition-all duration-150",
                        active
                          ? "border-[var(--color-accent)] shadow-[0_0_0_2px_var(--color-accent)]"
                          : "border-[var(--color-line)] hover:scale-110",
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className="h-4 w-4"
                            style={{ color: c.key === "bianco" ? "#bf4f7b" : "white" }}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {draft.color && (
                <p className="text-xs text-[var(--color-muted)]">
                  Selezionato: {activeShirtColors.find((c) => c.key === draft.color)?.label}
                </p>
              )}
            </div>

            {/* Posizione stampa */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Posizione stampa <span className="text-[var(--color-accent)]">*</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {PRINT_POSITIONS.map((pos) => {
                  const active = draft.printPosition === pos.key;
                  return (
                    <button
                      key={pos.key}
                      type="button"
                      onClick={() => update("printPosition", pos.key)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[1.5rem] border px-4 py-4 text-center transition-all duration-200",
                        active
                          ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.06)] shadow-sm"
                          : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50",
                      )}
                    >
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]",
                        )}
                      >
                        {pos.label}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">{pos.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload logo + Quantità */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Logo/design e quantità
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Carica il tuo file di stampa e indica quante magliette ti servono.
              </p>
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Logo o design da stampare{" "}
                <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {draft.logoUrl ? (
                <div className="relative inline-block">
                  <div className="relative h-32 w-32 overflow-hidden rounded-[1.5rem] border border-[var(--color-line)]">
                    <Image src={draft.logoUrl} alt="Design" fill className="object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => update("logoUrl", undefined)}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-line)] text-[var(--color-muted)] hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <Upload className="h-5 w-5" />
                  Carica il tuo logo o design (JPG, PNG, SVG, PDF)
                </button>
              )}
            </div>

            {/* Testo aggiuntivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Testo aggiuntivo{" "}
                <span className="text-xs font-normal text-[var(--color-muted)]">(opzionale)</span>
              </label>
              <Input
                value={draft.customText}
                onChange={(e) => update("customText", e.target.value)}
                placeholder="Es. Nome squadra, slogan, data evento..."
                maxLength={60}
              />
            </div>

            {/* Quantità */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-foreground)]">Quantità</p>
              <QuantitySelector
                value={draft.quantity}
                onChange={(v) => update("quantity", v)}
                presets={[1, 5, 10, 20]}
                min={1}
                max={500}
              />
            </div>

            {draft.shirtType && (
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted)]">
                    {euro(unitPrice)}/pz × {draft.quantity}
                    {draft.printPosition === "entrambi" && (
                      <span className="ml-1 text-xs">(incl. +€{settings.magliettePrices.printBothSidesSurcharge}/pz fronte+retro)</span>
                    )}
                  </span>
                  <span className="text-xl font-bold text-[var(--color-accent)]">
                    {euro(totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Riepilogo */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                Riepilogo ordine
              </h2>
            </div>
            <Card className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryRow
                  label="Tipo"
                  value={activeShirtTypes.find((t) => t.key === draft.shirtType)?.label ?? ""}
                />
                <SummaryRow label="Taglia" value={draft.size ?? ""} />
                <SummaryRow
                  label="Colore"
                  value={activeShirtColors.find((c) => c.key === draft.color)?.label ?? ""}
                />
                <SummaryRow
                  label="Posizione stampa"
                  value={PRINT_POSITIONS.find((p) => p.key === draft.printPosition)?.label ?? ""}
                />
                {draft.customText && <SummaryRow label="Testo" value={draft.customText} />}
                <SummaryRow label="Design" value={draft.logoUrl ? "File allegato" : "Nessun file"} />
                <SummaryRow label="Quantità" value={`${draft.quantity} pezzi`} />
              </div>
            </Card>
            <Card className="space-y-3 bg-gradient-to-br from-white to-[rgba(191,79,123,0.04)]">
              <p className="font-semibold text-[var(--color-foreground)]">Stima del prezzo</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Prezzo unitario</span>
                  <span className="font-medium">{euro(unitPrice)}/pz</span>
                </div>
                {draft.printPosition === "entrambi" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-muted)]">
                      Incl. surcharge fronte+retro (+{euro(settings.magliettePrices.printBothSidesSurcharge)}/pz)
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Quantità</span>
                  <span className="font-medium">× {draft.quantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-2">
                  <span className="font-bold text-[var(--color-foreground)]">Totale stimato</span>
                  <span className="text-2xl font-bold text-[var(--color-accent)]">
                    {euro(totalPrice)}
                  </span>
                </div>
              </div>
            </Card>
            <Button className="w-full gap-2" size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" />
              Aggiungi al carrello
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (step === 1) onBack();
            else setStep((s) => s - 1);
          }}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {step === 1 ? "Categorie" : "Indietro"}
        </Button>
        {step < 4 && (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            {step === 3 ? "Vedi riepilogo" : "Avanti"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}

// ── Generic Flow (imported from separate file) ───────────────────────────────

import { GenericFlow } from "./generic-flow";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ConfiguratoreClientPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [settings, setSettings] = useState<ConfiguratorSettings>(defaultConfiguratorSettings);

  useEffect(() => {
    fetch("/api/configuratore/settings")
      .then((r) => r.json())
      .then((data: ConfiguratorSettings) => {
        // Merge intelligente: non sovrascrivere array vuoti (usa default)
        const merged: ConfiguratorSettings = { ...defaultConfiguratorSettings };
        for (const key in data) {
          const value = data[key as keyof ConfiguratorSettings];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value) && value.length === 0) {
              continue; // Mantieni default se array vuoto
            }
            (merged as Record<string, unknown>)[key] = value;
          }
        }
        setSettings(merged);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Configuratore PassionArt
        </p>
        <h1 className="font-display text-4xl leading-none text-[var(--color-foreground)] md:text-5xl">
          Crea il tuo ricordo su misura.
        </h1>
        <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
          Ogni pezzo è dipinto o stampato a mano dalla nostra artigiana. Scegli la categoria e configura il tuo prodotto in pochi passi.
        </p>
      </div>

      {/* Category breadcrumb */}
      {category && (
        <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Categorie
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[var(--color-foreground)] capitalize">{category}</span>
        </div>
      )}

      {/* Content */}
      {!category && <CategorySelector settings={settings} onSelect={setCategory} />}
      {category === "bomboniere" && (
        <BomboniereFlow settings={settings} onBack={() => setCategory(null)} />
      )}
      {category === "tazze" && (
        <TazzeFlow settings={settings} onBack={() => setCategory(null)} />
      )}
      {category === "magliette" && (
        <MaglietteFlow settings={settings} onBack={() => setCategory(null)} />
      )}
      {category && !["bomboniere", "tazze", "magliette"].includes(category) && (
        <GenericFlow category={category} settings={settings} onBack={() => setCategory(null)} />
      )}
    </div>
  );
}
