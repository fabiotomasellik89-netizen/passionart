"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { euro } from "@/lib/utils";
import type {
  ConfiguratorEvent,
  ConfiguratorSettings,
  ConfiguratorTheme,
  PaletteColor,
} from "@/types";

const TABS = [
  "Temi",
  "Eventi",
  "Formati & Prezzi",
  "Add-on",
  "Colori",
  "Impostazioni",
];

const BOMBONIERE_FORMAT_KEYS = [
  { key: "bomboniera-singola", label: "Bomboniera singola" },
  { key: "set-cesta", label: "Set con cesta" },
  { key: "decorazione-quadretto", label: "Decorazione/Quadretto" },
];
const BOMBONIERE_SIZE_KEYS = ["piccola", "media", "grande"];

const PALETTE_SIZE_KEYS = ["25x25", "30x30", "25x35", "30x40", "personalizzata"];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-[var(--color-foreground)]">{title}</p>
      {desc && <p className="text-sm text-[var(--color-muted)]">{desc}</p>}
    </div>
  );
}

// ── Tab: Temi ─────────────────────────────────────────────────────────────────

function TabTemi({
  themes,
  onChange,
}: {
  themes: ConfiguratorTheme[];
  onChange: (themes: ConfiguratorTheme[]) => void;
}) {
  function update(index: number, field: keyof ConfiguratorTheme, value: string | boolean) {
    const next = themes.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    onChange(next);
  }

  function add() {
    onChange([
      ...themes,
      { key: `tema-${Date.now()}`, label: "Nuovo tema", desc: "", img: "", active: true },
    ]);
  }

  function remove(index: number) {
    onChange(themes.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Temi / Personaggi"
        desc="Gestisci i temi disponibili nel configuratore. Puoi aggiungere, rimuovere o disattivare un tema."
      />
      {themes.map((theme, i) => (
        <Card key={i} className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--color-foreground)]">Tema #{i + 1}</p>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={theme.active}
                  onChange={(e) => update(i, "active", e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
                Attivo
              </label>
              <Button variant="outline" size="sm" onClick={() => remove(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Chiave (key)"
              value={theme.key}
              onChange={(e) => update(i, "key", e.target.value)}
              placeholder="es. topolino"
            />
            <Input
              label="Nome visualizzato"
              value={theme.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="es. Topolino / Mickey"
            />
            <Input
              label="Descrizione breve"
              value={theme.desc}
              onChange={(e) => update(i, "desc", e.target.value)}
              placeholder="es. Il classico Disney amato da tutti"
            />
            <Input
              label="Immagine (URL o path)"
              value={theme.img}
              onChange={(e) => update(i, "img", e.target.value)}
              placeholder="es. /images/products/mickey-nascita.jpeg"
            />
          </div>
        </Card>
      ))}
      <Button variant="secondary" onClick={add} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi tema
      </Button>
    </div>
  );
}

// ── Tab: Eventi ───────────────────────────────────────────────────────────────

function TabEventi({
  events,
  onChange,
}: {
  events: ConfiguratorEvent[];
  onChange: (events: ConfiguratorEvent[]) => void;
}) {
  function update(index: number, field: keyof ConfiguratorEvent, value: string | boolean) {
    const next = events.map((e, i) => (i === index ? { ...e, [field]: value } : e));
    onChange(next);
  }

  function add() {
    onChange([
      ...events,
      { key: `evento-${Date.now()}`, label: "Nuovo evento", icon: "✨", active: true },
    ]);
  }

  function remove(index: number) {
    onChange(events.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Eventi"
        desc="Lista degli eventi disponibili nel configuratore (nascita, battesimo, compleanno, ecc.)."
      />
      {events.map((ev, i) => (
        <Card key={i} className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--color-foreground)]">Evento #{i + 1}</p>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={ev.active}
                  onChange={(e) => update(i, "active", e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
                Attivo
              </label>
              <Button variant="outline" size="sm" onClick={() => remove(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Chiave (key)"
              value={ev.key}
              onChange={(e) => update(i, "key", e.target.value)}
              placeholder="es. nascita"
            />
            <Input
              label="Nome visualizzato"
              value={ev.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="es. Nascita"
            />
            <Input
              label="Icona (emoji)"
              value={ev.icon}
              onChange={(e) => update(i, "icon", e.target.value)}
              placeholder="es. 🌟"
            />
          </div>
        </Card>
      ))}
      <Button variant="secondary" onClick={add} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi evento
      </Button>
    </div>
  );
}

// ── Tab: Formati & Prezzi ─────────────────────────────────────────────────────

function TabFormatiPrezzi({
  basePrices,
  onChange,
}: {
  basePrices: Record<string, Record<string, number>>;
  onChange: (basePrices: Record<string, Record<string, number>>) => void;
}) {
  function updatePrice(format: string, size: string, value: number) {
    onChange({
      ...basePrices,
      [format]: { ...(basePrices[format] ?? {}), [size]: value },
    });
  }

  return (
    <div className="space-y-6">
      {/* Bomboniere */}
      <div className="space-y-4">
        <SectionHeader
          title="Bomboniere — Prezzi Base"
          desc="Prezzo base per ogni combinazione formato × dimensione (piccola ~8×8 cm, media ~12×12 cm, grande ~18×18 cm)."
        />
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Formato
                </th>
                {BOMBONIERE_SIZE_KEYS.map((size) => (
                  <th
                    key={size}
                    className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {BOMBONIERE_FORMAT_KEYS.map(({ key, label }) => (
                <tr key={key}>
                  <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">{label}</td>
                  {BOMBONIERE_SIZE_KEYS.map((size) => (
                    <td key={size} className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--color-muted)]">€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={basePrices[key]?.[size] ?? 0}
                          onChange={(e) => updatePrice(key, size, Number(e.target.value))}
                          className="w-20 rounded-xl border border-[var(--color-line)] bg-white/90 px-2 py-1.5 text-center text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Palette in Legno */}
      <div className="space-y-4">
        <SectionHeader
          title="🎨 Palette in Legno — Prezzi"
          desc="Tavolette dipinte a mano con dimensioni maggiori. Prezzi per pezzo singolo."
        />
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Misura
                </th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Prezzo (€)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {PALETTE_SIZE_KEYS.map((size) => (
                <tr key={size}>
                  <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                    {size === "personalizzata" ? "Personalizzata (min 25×25 cm)" : size + " cm"}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--color-muted)]">€</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={basePrices["palette"]?.[size] ?? 0}
                        onChange={(e) => updatePrice("palette", size, Number(e.target.value))}
                        className="w-24 rounded-xl border border-[var(--color-line)] bg-white/90 px-2 py-1.5 text-center text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
          Le palette sono pezzi unici dipinti a mano. Il prezzo per &quot;Personalizzata&quot; è il base — il preventivo finale verrà concordato con il cliente.
        </div>
      </div>
    </div>
  );
}

// ── Tab: Add-on ───────────────────────────────────────────────────────────────

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = items.map((v, j) => (j === i ? e.target.value : v));
                onChange(next);
              }}
              placeholder={placeholder}
              className="flex-1 rounded-2xl border border-[var(--color-line)] bg-white/90 px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
      >
        <Plus className="h-3 w-3" />
        Aggiungi
      </button>
    </div>
  );
}

function TabAddon({
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Add-on e Prezzi"
        desc="Gestisci le opzioni aggiuntive disponibili nel configuratore bomboniere e i relativi prezzi per pezzo."
      />

      {/* Confetti */}
      <Card className="space-y-4">
        <p className="font-semibold text-[var(--color-foreground)]">🍬 Confetti</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <StringListEditor
            label="Gusti disponibili"
            items={settings.confettiFlavors}
            onChange={(v) => onChange({ confettiFlavors: v })}
            placeholder="es. Mandorla classica"
          />
          <StringListEditor
            label="Colori disponibili"
            items={settings.confettiColors}
            onChange={(v) => onChange({ confettiColors: v })}
            placeholder="es. Rosa"
          />
        </div>
        <Input
          label="Prezzo per pezzo (€)"
          type="number"
          min="0"
          step="0.1"
          value={settings.confettiPrice}
          onChange={(e) => onChange({ confettiPrice: Number(e.target.value) })}
          className="max-w-[160px]"
        />
      </Card>

      {/* Veli */}
      <Card className="space-y-4">
        <p className="font-semibold text-[var(--color-foreground)]">🎀 Veli e nastri</p>
        <StringListEditor
          label="Colori velo disponibili"
          items={settings.veilColors}
          onChange={(v) => onChange({ veilColors: v })}
          placeholder="es. Bianco"
        />
        <Input
          label="Prezzo per pezzo (€)"
          type="number"
          min="0"
          step="0.1"
          value={settings.veilPrice}
          onChange={(e) => onChange({ veilPrice: Number(e.target.value) })}
          className="max-w-[160px]"
        />
      </Card>

      {/* Cesta */}
      <Card className="space-y-3">
        <p className="font-semibold text-[var(--color-foreground)]">🧺 Cesta decorata</p>
        <Input
          label="Prezzo per pezzo (€)"
          type="number"
          min="0"
          step="0.1"
          value={settings.basketPrice}
          onChange={(e) => onChange({ basketPrice: Number(e.target.value) })}
          className="max-w-[160px]"
        />
      </Card>

      {/* Bigliettino */}
      <Card className="space-y-3">
        <p className="font-semibold text-[var(--color-foreground)]">💌 Bigliettino personalizzato</p>
        <Input
          label="Prezzo per pezzo (€)"
          type="number"
          min="0"
          step="0.1"
          value={settings.cardPrice}
          onChange={(e) => onChange({ cardPrice: Number(e.target.value) })}
          className="max-w-[160px]"
        />
      </Card>
    </div>
  );
}

// ── Tab: Colori ───────────────────────────────────────────────────────────────

function TabColori({
  paletteColors,
  onChange,
}: {
  paletteColors: PaletteColor[];
  onChange: (colors: PaletteColor[]) => void;
}) {
  function update(index: number, field: keyof PaletteColor, value: string) {
    onChange(paletteColors.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function add() {
    onChange([...paletteColors, { label: "Nuovo colore", hex: "#cccccc" }]);
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Palette Colori"
        desc="Gestisci i colori mostrati al cliente per scegliere le preferenze cromatiche."
      />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {paletteColors.map((color, i) => (
          <Card key={i} className="flex items-center gap-3 py-3">
            <div
              className="h-10 w-10 shrink-0 rounded-full border border-[var(--color-line)]"
              style={{ backgroundColor: color.hex }}
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                type="text"
                value={color.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="Nome colore"
                className="w-full rounded-xl border border-[var(--color-line)] bg-white/90 px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]"
              />
              <input
                type="text"
                value={color.hex}
                onChange={(e) => update(i, "hex", e.target.value)}
                placeholder="#ffffff"
                className="w-full rounded-xl border border-[var(--color-line)] bg-white/90 px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(paletteColors.filter((_, j) => j !== i))}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </Card>
        ))}
      </div>
      <Button variant="secondary" onClick={add} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi colore
      </Button>
    </div>
  );
}

// ── Tab: Impostazioni ─────────────────────────────────────────────────────────

function TabImpostazioni({
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  function patchTazze(field: keyof ConfiguratorSettings["tazzePrices"], value: number) {
    onChange({ tazzePrices: { ...settings.tazzePrices, [field]: value } });
  }

  function patchMagliette(field: keyof ConfiguratorSettings["magliettePrices"], value: number) {
    onChange({ magliettePrices: { ...settings.magliettePrices, [field]: value } });
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Impostazioni Generali"
        desc="Parametri globali del configuratore visibili ai clienti."
      />
      <Card className="space-y-4">
        <Input
          label="Prezzo minimo ordine (€)"
          type="number"
          min="0"
          step="1"
          value={settings.minimumOrderPrice}
          onChange={(e) => onChange({ minimumOrderPrice: Number(e.target.value) })}
          className="max-w-[200px]"
        />
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Nota sui tempi di lavorazione
          </p>
          <textarea
            value={settings.productionTimeNote}
            onChange={(e) => onChange({ productionTimeNote: e.target.value })}
            rows={3}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Messaggio nel riepilogo
          </p>
          <textarea
            value={settings.summaryMessage}
            onChange={(e) => onChange({ summaryMessage: e.target.value })}
            rows={3}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
          />
        </div>
        {settings.minimumOrderPrice > 0 && (
          <div className="rounded-2xl bg-[rgba(191,79,123,0.06)] px-4 py-3 text-sm text-[var(--color-foreground)]">
            Il cliente dovrà ordinare almeno{" "}
            <span className="font-semibold text-[var(--color-accent)]">
              {euro(settings.minimumOrderPrice)}
            </span>{" "}
            per procedere.
          </div>
        )}
      </Card>

      {/* Tazze prices */}
      <Card className="space-y-4">
        <p className="font-semibold text-[var(--color-foreground)]">☕ Prezzi Tazze</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Tazza Classica (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.tazzePrices.classica}
            onChange={(e) => patchTazze("classica", Number(e.target.value))}
          />
          <Input
            label="Tazza Magica (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.tazzePrices.magica}
            onChange={(e) => patchTazze("magica", Number(e.target.value))}
          />
          <Input
            label="Con Cucchiaino (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.tazzePrices["con-cucchiaio"]}
            onChange={(e) => patchTazze("con-cucchiaio", Number(e.target.value))}
          />
        </div>
      </Card>

      {/* Magliette prices */}
      <Card className="space-y-4">
        <p className="font-semibold text-[var(--color-foreground)]">👕 Prezzi Magliette</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="T-Shirt Manica Corta (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.magliettePrices["tshirt-manica-corta"]}
            onChange={(e) => patchMagliette("tshirt-manica-corta", Number(e.target.value))}
          />
          <Input
            label="T-Shirt Manica Lunga (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.magliettePrices["tshirt-manica-lunga"]}
            onChange={(e) => patchMagliette("tshirt-manica-lunga", Number(e.target.value))}
          />
          <Input
            label="Polo (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.magliettePrices.polo}
            onChange={(e) => patchMagliette("polo", Number(e.target.value))}
          />
          <Input
            label="Surcharge Fronte+Retro (€/pz)"
            type="number"
            min="0"
            step="0.5"
            value={settings.magliettePrices.printBothSidesSurcharge}
            onChange={(e) => patchMagliette("printBothSidesSurcharge", Number(e.target.value))}
          />
        </div>
      </Card>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminConfiguratoreSettingsPage() {
  const [settings, setSettings] = useState<ConfiguratorSettings | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/configuratore")
      .then((r) => r.json())
      .then((json: { settings: ConfiguratorSettings }) => setSettings(json.settings))
      .catch(() => undefined);
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/configuratore", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSavedMsg("Salvato con successo!");
    setTimeout(() => setSavedMsg(""), 3000);
  }

  function patch(partial: Partial<ConfiguratorSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-muted)]">
        Caricamento impostazioni...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Configuratore
          </p>
          <h1 className="font-display text-5xl text-[var(--color-foreground)]">
            Impostazioni configuratore
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Gestisci temi, eventi, prezzi (bomboniere, palette, tazze, magliette), add-on e messaggi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="rounded-2xl bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
              {savedMsg}
            </span>
          )}
          <Button onClick={save} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Salvataggio..." : "Salva tutto"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-4">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              activeTab === i
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 0 && (
          <TabTemi themes={settings.themes} onChange={(v) => patch({ themes: v })} />
        )}
        {activeTab === 1 && (
          <TabEventi events={settings.events} onChange={(v) => patch({ events: v })} />
        )}
        {activeTab === 2 && (
          <TabFormatiPrezzi
            basePrices={settings.basePrices}
            onChange={(v) => patch({ basePrices: v })}
          />
        )}
        {activeTab === 3 && <TabAddon settings={settings} onChange={patch} />}
        {activeTab === 4 && (
          <TabColori
            paletteColors={settings.paletteColors}
            onChange={(v) => patch({ paletteColors: v })}
          />
        )}
        {activeTab === 5 && <TabImpostazioni settings={settings} onChange={patch} />}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-10 -mx-4 border-t border-[var(--color-line)] bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)]">
            Le modifiche sono attive immediatamente sul configuratore front-end.
          </p>
          <Button onClick={save} disabled={saving} className="gap-2">
            <Settings className="h-4 w-4" />
            {saving ? "Salvataggio..." : "Salva impostazioni"}
          </Button>
        </div>
      </div>
    </div>
  );
}
