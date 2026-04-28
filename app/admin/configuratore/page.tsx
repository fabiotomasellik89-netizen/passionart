"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { euro } from "@/lib/utils";
import type {
  CategoryAddonGroup,
  CategoryAddonOption,
  CategoryColor,
  CategorySettings,
  CategoryVariant,
  ConfiguratorCategory,
  ConfiguratorEvent,
  ConfiguratorSettings,
  ConfiguratorTheme,
  PaletteColor,
} from "@/types";

const TABS = [
  "Categorie",
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

function PriceInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[var(--color-muted)]">€</span>
      <input
        type="number"
        min="0"
        step="0.5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 rounded-xl border border-[var(--color-line)] bg-white/90 px-2 py-1.5 text-center text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
      />
    </div>
  );
}

// ── Shared: Category Tab Selector ─────────────────────────────────────────────

function CategoryTabSelector({
  categories,
  active,
  onChange,
}: {
  categories: ConfiguratorCategory[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-[var(--color-surface)] p-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          onClick={() => onChange(cat.key)}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            active === cat.key
              ? "bg-[var(--color-accent)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-foreground)]"
          }`}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  );
}

// ── Shared: Category Variant Editor ──────────────────────────────────────────

function VariantEditor({
  variants,
  onChange,
}: {
  variants: CategoryVariant[];
  onChange: (variants: CategoryVariant[]) => void;
}) {
  function update(index: number, field: keyof CategoryVariant, value: string | number | boolean) {
    onChange(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  function add() {
    onChange([
      ...variants,
      {
        key: `variante-${Date.now()}`,
        label: "Nuova variante",
        desc: "",
        img: "",
        price: 0,
        active: true,
      },
    ]);
  }

  function remove(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {variants.map((v, i) => (
        <Card key={i} className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--color-foreground)]">Variante #{i + 1}</p>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={v.active}
                  onChange={(e) => update(i, "active", e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
                Attiva
              </label>
              <Button variant="outline" size="sm" onClick={() => remove(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Chiave (key)"
              value={v.key}
              onChange={(e) => update(i, "key", e.target.value)}
              placeholder="es. classica"
            />
            <Input
              label="Nome visualizzato"
              value={v.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="es. Tazza Classica"
            />
            <Input
              label="Descrizione breve"
              value={v.desc}
              onChange={(e) => update(i, "desc", e.target.value)}
              placeholder="es. Ceramica bianca, stampa permanente"
            />
            <Input
              label="Immagine (URL o path)"
              value={v.img}
              onChange={(e) => update(i, "img", e.target.value)}
              placeholder="es. /images/products/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-[var(--color-foreground)]">Prezzo (€/pz)</p>
            <PriceInput value={v.price} onChange={(val) => update(i, "price", val)} />
          </div>
        </Card>
      ))}
      <Button variant="secondary" onClick={add} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi variante
      </Button>
    </div>
  );
}

// ── Shared: Category Color Editor ─────────────────────────────────────────────

function CategoryColorEditor({
  colors,
  onChange,
}: {
  colors: CategoryColor[];
  onChange: (colors: CategoryColor[]) => void;
}) {
  function update(index: number, field: keyof CategoryColor, value: string | boolean) {
    onChange(colors.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function add() {
    onChange([
      ...colors,
      { key: `colore-${Date.now()}`, label: "Nuovo colore", hex: "#cccccc", active: true },
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {colors.map((color, i) => (
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
            <div className="flex flex-col items-center gap-1.5">
              <label className="flex cursor-pointer items-center gap-1 text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={color.active}
                  onChange={(e) => update(i, "active", e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(colors.filter((_, j) => j !== i))}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
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

// ── Shared: Category Addon Editor ─────────────────────────────────────────────

function CategoryAddonEditor({
  addonGroups,
  onChange,
}: {
  addonGroups: CategoryAddonGroup[];
  onChange: (groups: CategoryAddonGroup[]) => void;
}) {
  function addGroup() {
    onChange([
      ...addonGroups,
      { key: `addon-${Date.now()}`, name: "Nuovo add-on", options: [] },
    ]);
  }

  function removeGroup(gi: number) {
    onChange(addonGroups.filter((_, i) => i !== gi));
  }

  function updateGroup(gi: number, field: keyof Pick<CategoryAddonGroup, "key" | "name">, value: string) {
    onChange(addonGroups.map((g, i) => (i === gi ? { ...g, [field]: value } : g)));
  }

  function addOption(gi: number) {
    const groups = addonGroups.map((g, i) => {
      if (i !== gi) return g;
      return {
        ...g,
        options: [
          ...g.options,
          { key: `opt-${Date.now()}`, label: "Nuova opzione", price: 0, active: true },
        ],
      };
    });
    onChange(groups);
  }

  function removeOption(gi: number, oi: number) {
    onChange(
      addonGroups.map((g, i) =>
        i === gi ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g,
      ),
    );
  }

  function updateOption(
    gi: number,
    oi: number,
    field: keyof CategoryAddonOption,
    value: string | number | boolean,
  ) {
    onChange(
      addonGroups.map((g, i) =>
        i === gi
          ? { ...g, options: g.options.map((o, j) => (j === oi ? { ...o, [field]: value } : o)) }
          : g,
      ),
    );
  }

  return (
    <div className="space-y-4">
      {addonGroups.map((group, gi) => (
        <Card key={gi} className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              Gruppo Add-on #{gi + 1}
            </p>
            <Button variant="outline" size="sm" onClick={() => removeGroup(gi)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Chiave (key)"
              value={group.key}
              onChange={(e) => updateGroup(gi, "key", e.target.value)}
              placeholder="es. confezione-regalo"
            />
            <Input
              label="Nome gruppo"
              value={group.name}
              onChange={(e) => updateGroup(gi, "name", e.target.value)}
              placeholder="es. Confezione Regalo"
            />
          </div>
          <div className="space-y-2 border-l-2 border-[var(--color-line)] pl-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Opzioni
            </p>
            {group.options.length === 0 && (
              <p className="text-xs text-[var(--color-muted)]">Nessuna opzione. Aggiungine una.</p>
            )}
            {group.options.map((opt, oi) => (
              <div key={oi} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => updateOption(gi, oi, "label", e.target.value)}
                  placeholder="Nome opzione"
                  className="flex-1 rounded-xl border border-[var(--color-line)] bg-white/90 px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-[var(--color-muted)]">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={opt.price}
                    onChange={(e) => updateOption(gi, oi, "price", Number(e.target.value))}
                    className="w-20 rounded-xl border border-[var(--color-line)] bg-white/90 px-2 py-2 text-center text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-1 text-xs text-[var(--color-muted)]">
                  <input
                    type="checkbox"
                    checked={opt.active}
                    onChange={(e) => updateOption(gi, oi, "active", e.target.checked)}
                    className="accent-[var(--color-accent)]"
                  />
                  Attiva
                </label>
                <button
                  type="button"
                  onClick={() => removeOption(gi, oi)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(gi)}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              <Plus className="h-3 w-3" />
              Aggiungi opzione
            </button>
          </div>
        </Card>
      ))}
      <Button variant="secondary" onClick={addGroup} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi gruppo add-on
      </Button>
    </div>
  );
}

// ── Helper to read/write per-category settings ────────────────────────────────

function emptyCategorySettings(): CategorySettings {
  return { variants: [], colors: [], addons: [] };
}

// ── Tab: Categorie ────────────────────────────────────────────────────────────

function TabCategorie({
  categories,
  onChange,
}: {
  categories: ConfiguratorCategory[];
  onChange: (categories: ConfiguratorCategory[]) => void;
}) {
  function update(index: number, field: keyof ConfiguratorCategory, value: string | boolean) {
    onChange(categories.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function add() {
    onChange([
      ...categories,
      {
        key: `categoria-${Date.now()}`,
        label: "Nuova categoria",
        icon: "✨",
        description: "",
        active: true,
      },
    ]);
  }

  function remove(index: number) {
    const cat = categories[index];
    if (["bomboniere", "tazze", "magliette"].includes(cat.key)) {
      alert("Le categorie di sistema (Bomboniere, Tazze, Magliette) non possono essere eliminate.");
      return;
    }
    onChange(categories.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Categorie del Configuratore"
        desc="Gestisci le categorie disponibili nel configuratore. Puoi aggiungere nuove categorie, modificarle o disattivarle. Le 3 categorie di sistema (Bomboniere, Tazze, Magliette) non possono essere eliminate."
      />
      {categories.map((cat, i) => {
        const isSystem = ["bomboniere", "tazze", "magliette"].includes(cat.key);
        return (
          <Card key={i} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  {cat.label}
                  {isSystem && (
                    <span className="ml-2 rounded-full bg-[rgba(191,79,123,0.1)] px-2 py-0.5 text-xs text-[var(--color-accent)]">
                      sistema
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <input
                    type="checkbox"
                    checked={cat.active}
                    onChange={(e) => update(i, "active", e.target.checked)}
                    className="accent-[var(--color-accent)]"
                  />
                  Attiva
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(i)}
                  disabled={isSystem}
                  title={isSystem ? "Categoria di sistema — non eliminabile" : "Elimina categoria"}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Chiave (key)"
                value={cat.key}
                onChange={(e) => update(i, "key", e.target.value)}
                placeholder="es. cappelli"
                disabled={isSystem}
              />
              <Input
                label="Nome visualizzato"
                value={cat.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="es. Cappelli"
              />
              <Input
                label="Icona (emoji)"
                value={cat.icon}
                onChange={(e) => update(i, "icon", e.target.value)}
                placeholder="es. 🎩"
              />
              <Input
                label="Descrizione"
                value={cat.description}
                onChange={(e) => update(i, "description", e.target.value)}
                placeholder="Breve descrizione per i clienti"
              />
            </div>
          </Card>
        );
      })}
      <Button variant="secondary" onClick={add} className="gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi nuova categoria
      </Button>
      <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
        Le nuove categorie appaiono automaticamente nel configuratore front-end. Per ogni nuova
        categoria puoi configurare i prezzi nel tab &ldquo;Formati & Prezzi&rdquo;.
      </div>
    </div>
  );
}

// ── Tab: Temi ─────────────────────────────────────────────────────────────────

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

function TabTemi({
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  const allCategories = settings.categories ?? [];
  const [activeCat, setActiveCat] = useState(allCategories[0]?.key ?? "bomboniere");

  function patchCategorySettings(catKey: string, partial: Partial<CategorySettings>) {
    const existing = settings.categorySettings?.[catKey] ?? emptyCategorySettings();
    onChange({
      categorySettings: {
        ...(settings.categorySettings ?? {}),
        [catKey]: { ...existing, ...partial },
      },
    });
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Temi / Varianti"
        desc="Seleziona la categoria e gestisci i temi (per Bomboniere) o le varianti di prodotto (per Tazze, Magliette e categorie custom). Puoi aggiungere, rimuovere o disattivare ogni opzione."
      />

      <CategoryTabSelector categories={allCategories} active={activeCat} onChange={setActiveCat} />

      {/* ── Bomboniere: temi/personaggi ── */}
      {activeCat === "bomboniere" && (
        <div className="space-y-4">
          <SectionHeader
            title="🎁 Bomboniere — Temi / Personaggi"
            desc="Questi sono i soggetti selezionabili nel configuratore bomboniere."
          />
          {settings.themes.map((theme, i) => (
            <Card key={i} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[var(--color-foreground)]">Tema #{i + 1}</p>
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)]">
                    <input
                      type="checkbox"
                      checked={theme.active}
                      onChange={(e) => {
                        const next = settings.themes.map((t, j) =>
                          j === i ? { ...t, active: e.target.checked } : t,
                        );
                        onChange({ themes: next });
                      }}
                      className="accent-[var(--color-accent)]"
                    />
                    Attivo
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange({ themes: settings.themes.filter((_, j) => j !== i) })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Chiave (key)"
                  value={theme.key}
                  onChange={(e) => {
                    const next = settings.themes.map((t, j) =>
                      j === i ? { ...t, key: e.target.value } : t,
                    );
                    onChange({ themes: next });
                  }}
                  placeholder="es. topolino"
                />
                <Input
                  label="Nome visualizzato"
                  value={theme.label}
                  onChange={(e) => {
                    const next = settings.themes.map((t, j) =>
                      j === i ? { ...t, label: e.target.value } : t,
                    );
                    onChange({ themes: next });
                  }}
                  placeholder="es. Topolino / Mickey"
                />
                <Input
                  label="Descrizione breve"
                  value={theme.desc}
                  onChange={(e) => {
                    const next = settings.themes.map((t, j) =>
                      j === i ? { ...t, desc: e.target.value } : t,
                    );
                    onChange({ themes: next });
                  }}
                  placeholder="es. Il classico Disney amato da tutti"
                />
                <Input
                  label="Immagine (URL o path)"
                  value={theme.img}
                  onChange={(e) => {
                    const next = settings.themes.map((t, j) =>
                      j === i ? { ...t, img: e.target.value } : t,
                    );
                    onChange({ themes: next });
                  }}
                  placeholder="es. /images/products/mickey-nascita.jpeg"
                />
              </div>
            </Card>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              onChange({
                themes: [
                  ...settings.themes,
                  {
                    key: `tema-${Date.now()}`,
                    label: "Nuovo tema",
                    desc: "",
                    img: "",
                    active: true,
                  } satisfies ConfiguratorTheme,
                ],
              })
            }
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Aggiungi tema
          </Button>
        </div>
      )}

      {/* ── Tazze: varianti ── */}
      {activeCat === "tazze" && (
        <div className="space-y-4">
          <SectionHeader
            title="☕ Tazze — Varianti"
            desc="Gestisci le varianti di tazza disponibili nel configuratore. Puoi modificare nome, immagine, prezzo e disattivarle."
          />
          <VariantEditor
            variants={settings.categorySettings?.tazze?.variants ?? []}
            onChange={(variants) => patchCategorySettings("tazze", { variants })}
          />
        </div>
      )}

      {/* ── Magliette: varianti ── */}
      {activeCat === "magliette" && (
        <div className="space-y-4">
          <SectionHeader
            title="👕 Magliette — Tipi"
            desc="Gestisci i tipi di maglietta disponibili nel configuratore. Puoi modificare nome, immagine, prezzo e disattivarli."
          />
          <VariantEditor
            variants={settings.categorySettings?.magliette?.variants ?? []}
            onChange={(variants) => patchCategorySettings("magliette", { variants })}
          />
        </div>
      )}

      {/* ── Categorie custom ── */}
      {activeCat !== "bomboniere" &&
        activeCat !== "tazze" &&
        activeCat !== "magliette" && (
          <div className="space-y-4">
            <SectionHeader
              title={`${allCategories.find((c) => c.key === activeCat)?.icon ?? ""} ${allCategories.find((c) => c.key === activeCat)?.label ?? activeCat} — Varianti`}
              desc="Gestisci le varianti disponibili per questa categoria custom."
            />
            <VariantEditor
              variants={settings.categorySettings?.[activeCat]?.variants ?? []}
              onChange={(variants) => patchCategorySettings(activeCat, { variants })}
            />
          </div>
        )}
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
      {/* Info banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">🕊️ Gli eventi sono specifici per le Bomboniere</p>
        <p className="mt-1 text-xs">
          Gli eventi (Nascita, Battesimo, Comunione, ecc.) vengono utilizzati solo nel configuratore
          delle Bomboniere per adattare il tema grafico all&apos;occasione. Per Tazze, Magliette e
          categorie custom, le varianti si configurano nel tab &ldquo;Temi&rdquo;.
        </p>
      </div>
      <SectionHeader
        title="Eventi (Bomboniere)"
        desc="Lista degli eventi disponibili nel configuratore bomboniere (nascita, battesimo, compleanno, ecc.)."
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
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  function updateBasePrice(format: string, size: string, value: number) {
    onChange({
      basePrices: {
        ...settings.basePrices,
        [format]: { ...(settings.basePrices[format] ?? {}), [size]: value },
      },
    });
  }

  function patchTazze(field: keyof ConfiguratorSettings["tazzePrices"], value: number) {
    onChange({ tazzePrices: { ...settings.tazzePrices, [field]: value } });
  }

  function patchMagliette(field: keyof ConfiguratorSettings["magliettePrices"], value: number) {
    onChange({ magliettePrices: { ...settings.magliettePrices, [field]: value } });
  }

  function updateCustomPrice(catKey: string, priceKey: string, value: number) {
    const existing = settings.customCategoryPrices?.[catKey] ?? {};
    onChange({
      customCategoryPrices: {
        ...(settings.customCategoryPrices ?? {}),
        [catKey]: { ...existing, [priceKey]: value },
      },
    });
  }

  function addCustomPriceRow(catKey: string) {
    const existing = settings.customCategoryPrices?.[catKey] ?? {};
    const newKey = `voce-${Date.now()}`;
    onChange({
      customCategoryPrices: {
        ...(settings.customCategoryPrices ?? {}),
        [catKey]: { ...existing, [newKey]: 0 },
      },
    });
  }

  function removeCustomPriceRow(catKey: string, priceKey: string) {
    const existing = { ...(settings.customCategoryPrices?.[catKey] ?? {}) };
    delete existing[priceKey];
    onChange({
      customCategoryPrices: {
        ...(settings.customCategoryPrices ?? {}),
        [catKey]: existing,
      },
    });
  }

  function renameCustomPriceKey(catKey: string, oldKey: string, newKey: string) {
    const existing = { ...(settings.customCategoryPrices?.[catKey] ?? {}) };
    const val = existing[oldKey] ?? 0;
    delete existing[oldKey];
    existing[newKey] = val;
    onChange({
      customCategoryPrices: {
        ...(settings.customCategoryPrices ?? {}),
        [catKey]: existing,
      },
    });
  }

  const customCategories = (settings.categories ?? []).filter(
    (c) => !["bomboniere", "tazze", "magliette"].includes(c.key),
  );

  return (
    <div className="space-y-8">
      {/* ── Bomboniere ── */}
      <div className="space-y-4">
        <SectionHeader
          title="🎁 Bomboniere — Prezzi Base"
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
                      <PriceInput
                        value={settings.basePrices[key]?.[size] ?? 0}
                        onChange={(v) => updateBasePrice(key, size, v)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Palette in Legno ── */}
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
                    <PriceInput
                      value={settings.basePrices["palette"]?.[size] ?? 0}
                      onChange={(v) => updateBasePrice("palette", size, v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
          Le palette sono pezzi unici dipinti a mano. Il prezzo per &quot;Personalizzata&quot; è il
          base — il preventivo finale verrà concordato con il cliente.
        </div>
      </div>

      {/* ── Tazze ── */}
      <div className="space-y-4">
        <SectionHeader
          title="☕ Tazze — Prezzi"
          desc="Prezzo per pezzo per ciascuna variante tazza. Nota: se hai configurato le varianti nel tab Temi, usa i prezzi indicati lì — questi valori sono di fallback."
        />
        <Card className="space-y-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Variante
                </th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Prezzo (€/pz)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  Tazza Classica
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.tazzePrices.classica}
                    onChange={(v) => patchTazze("classica", v)}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  Tazza Magica
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.tazzePrices.magica}
                    onChange={(v) => patchTazze("magica", v)}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  Con Cucchiaino
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.tazzePrices["con-cucchiaio"]}
                    onChange={(v) => patchTazze("con-cucchiaio", v)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Magliette ── */}
      <div className="space-y-4">
        <SectionHeader
          title="👕 Magliette — Prezzi"
          desc="Prezzo base per ciascun tipo di maglietta. Nota: se hai configurato le varianti nel tab Temi, usa i prezzi indicati lì — questi valori sono di fallback."
        />
        <Card className="space-y-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Modello
                </th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Prezzo (€/pz)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  T-Shirt Manica Corta
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.magliettePrices["tshirt-manica-corta"]}
                    onChange={(v) => patchMagliette("tshirt-manica-corta", v)}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  T-Shirt Manica Lunga
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.magliettePrices["tshirt-manica-lunga"]}
                    onChange={(v) => patchMagliette("tshirt-manica-lunga", v)}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">Polo</td>
                <td className="py-3">
                  <PriceInput
                    value={settings.magliettePrices.polo}
                    onChange={(v) => patchMagliette("polo", v)}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-medium text-[var(--color-foreground)]">
                  Supplemento Stampa Fronte+Retro
                </td>
                <td className="py-3">
                  <PriceInput
                    value={settings.magliettePrices.printBothSidesSurcharge}
                    onChange={(v) => patchMagliette("printBothSidesSurcharge", v)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Categorie personalizzate ── */}
      {customCategories.map((cat) => {
        const prices = settings.customCategoryPrices?.[cat.key] ?? {};
        const entries = Object.entries(prices);
        return (
          <div key={cat.key} className="space-y-4">
            <SectionHeader
              title={`${cat.icon} ${cat.label} — Prezzi`}
              desc={`Configura le voci di prezzo per la categoria "${cat.label}". Aggiungi le voci che vuoi mostrare al cliente.`}
            />
            <Card className="space-y-3">
              {entries.length === 0 && (
                <p className="text-sm text-[var(--color-muted)]">
                  Nessuna voce di prezzo configurata. Aggiungi la prima voce.
                </p>
              )}
              {entries.map(([priceKey, price]) => (
                <div key={priceKey} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={priceKey}
                    onChange={(e) => renameCustomPriceKey(cat.key, priceKey, e.target.value)}
                    placeholder="Nome voce (es. Standard)"
                    className="flex-1 rounded-xl border border-[var(--color-line)] bg-white/90 px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[var(--color-muted)]">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={price}
                      onChange={(e) => updateCustomPrice(cat.key, priceKey, Number(e.target.value))}
                      className="w-24 rounded-xl border border-[var(--color-line)] bg-white/90 px-2 py-2 text-center text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomPriceRow(cat.key, priceKey)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addCustomPriceRow(cat.key)}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
              >
                <Plus className="h-3 w-3" />
                Aggiungi voce di prezzo
              </button>
            </Card>
          </div>
        );
      })}

      {customCategories.length === 0 && (
        <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
          Aggiungi nuove categorie nel tab &ldquo;Categorie&rdquo; per configurarne i prezzi qui.
        </div>
      )}
    </div>
  );
}

// ── Tab: Add-on ───────────────────────────────────────────────────────────────

function TabAddon({
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  const allCategories = settings.categories ?? [];
  const [activeCat, setActiveCat] = useState(allCategories[0]?.key ?? "bomboniere");

  function patchCategorySettings(catKey: string, partial: Partial<CategorySettings>) {
    const existing = settings.categorySettings?.[catKey] ?? emptyCategorySettings();
    onChange({
      categorySettings: {
        ...(settings.categorySettings ?? {}),
        [catKey]: { ...existing, ...partial },
      },
    });
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Add-on e Prezzi"
        desc="Seleziona la categoria e gestisci le opzioni aggiuntive. Per Bomboniere: confetti, veli, cesta e bigliettino. Per Tazze e Magliette: add-on specifici."
      />

      <CategoryTabSelector categories={allCategories} active={activeCat} onChange={setActiveCat} />

      {/* ── Bomboniere: confetti / veli / cesta / bigliettino ── */}
      {activeCat === "bomboniere" && (
        <div className="space-y-5">
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
      )}

      {/* ── Tazze, Magliette, Custom: generic addon groups ── */}
      {activeCat !== "bomboniere" && (
        <div className="space-y-4">
          <SectionHeader
            title={`${allCategories.find((c) => c.key === activeCat)?.icon ?? ""} ${allCategories.find((c) => c.key === activeCat)?.label ?? activeCat} — Add-on`}
            desc="Gestisci i gruppi di add-on disponibili per questa categoria. Ogni gruppo può avere più opzioni con prezzi diversi."
          />
          <CategoryAddonEditor
            addonGroups={settings.categorySettings?.[activeCat]?.addons ?? []}
            onChange={(addons) => patchCategorySettings(activeCat, { addons })}
          />
        </div>
      )}
    </div>
  );
}

// ── Tab: Colori ───────────────────────────────────────────────────────────────

function TabColori({
  settings,
  onChange,
}: {
  settings: ConfiguratorSettings;
  onChange: (partial: Partial<ConfiguratorSettings>) => void;
}) {
  const allCategories = settings.categories ?? [];
  const [activeCat, setActiveCat] = useState(allCategories[0]?.key ?? "bomboniere");

  function patchCategorySettings(catKey: string, partial: Partial<CategorySettings>) {
    const existing = settings.categorySettings?.[catKey] ?? emptyCategorySettings();
    onChange({
      categorySettings: {
        ...(settings.categorySettings ?? {}),
        [catKey]: { ...existing, ...partial },
      },
    });
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Colori"
        desc="Seleziona la categoria e gestisci i colori disponibili. Per Bomboniere: palette preferenze colori. Per Tazze e Magliette: colori disponibili per i prodotti."
      />

      <CategoryTabSelector categories={allCategories} active={activeCat} onChange={setActiveCat} />

      {/* ── Bomboniere: palette preferenze colori ── */}
      {activeCat === "bomboniere" && (
        <div className="space-y-4">
          <SectionHeader
            title="🎁 Bomboniere — Palette Preferenze Colori"
            desc="Questi sono i colori che il cliente può selezionare come preferenze nella personalizzazione della bomboniera."
          />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {settings.paletteColors.map((color, i) => (
              <Card key={i} className="flex items-center gap-3 py-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-full border border-[var(--color-line)]"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={color.label}
                    onChange={(e) => {
                      const next = settings.paletteColors.map((c, j) =>
                        j === i ? { ...c, label: e.target.value } : c,
                      );
                      onChange({ paletteColors: next });
                    }}
                    placeholder="Nome colore"
                    className="w-full rounded-xl border border-[var(--color-line)] bg-white/90 px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]"
                  />
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => {
                      const next = settings.paletteColors.map((c, j) =>
                        j === i ? { ...c, hex: e.target.value } : c,
                      );
                      onChange({ paletteColors: next });
                    }}
                    placeholder="#ffffff"
                    className="w-full rounded-xl border border-[var(--color-line)] bg-white/90 px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ paletteColors: settings.paletteColors.filter((_, j) => j !== i) })
                  }
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:border-red-300 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Card>
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              onChange({
                paletteColors: [
                  ...settings.paletteColors,
                  { label: "Nuovo colore", hex: "#cccccc" } satisfies PaletteColor,
                ],
              })
            }
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Aggiungi colore
          </Button>
        </div>
      )}

      {/* ── Tazze: colori tazza ── */}
      {activeCat === "tazze" && (
        <div className="space-y-4">
          <SectionHeader
            title="☕ Tazze — Colori Disponibili"
            desc="Colori tazza disponibili nel configuratore. Se vuoto, non viene mostrata la selezione colore."
          />
          <CategoryColorEditor
            colors={settings.categorySettings?.tazze?.colors ?? []}
            onChange={(colors) => patchCategorySettings("tazze", { colors })}
          />
        </div>
      )}

      {/* ── Magliette: colori base ── */}
      {activeCat === "magliette" && (
        <div className="space-y-4">
          <SectionHeader
            title="👕 Magliette — Colori Base"
            desc="Colori di base disponibili per le magliette nel configuratore (bianco, nero, grigio, ecc.)."
          />
          <CategoryColorEditor
            colors={settings.categorySettings?.magliette?.colors ?? []}
            onChange={(colors) => patchCategorySettings("magliette", { colors })}
          />
        </div>
      )}

      {/* ── Categorie custom ── */}
      {activeCat !== "bomboniere" &&
        activeCat !== "tazze" &&
        activeCat !== "magliette" && (
          <div className="space-y-4">
            <SectionHeader
              title={`${allCategories.find((c) => c.key === activeCat)?.icon ?? ""} ${allCategories.find((c) => c.key === activeCat)?.label ?? activeCat} — Colori`}
              desc="Colori disponibili per questa categoria custom."
            />
            <CategoryColorEditor
              colors={settings.categorySettings?.[activeCat]?.colors ?? []}
              onChange={(colors) => patchCategorySettings(activeCat, { colors })}
            />
          </div>
        )}
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
        <p className="font-semibold text-[var(--color-foreground)]">☕ Prezzi Tazze (fallback)</p>
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
        <p className="font-semibold text-[var(--color-foreground)]">👕 Prezzi Magliette (fallback)</p>
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
            Gestisci categorie, varianti, temi, eventi, prezzi, add-on e colori per tutte le
            categorie (Bomboniere, Tazze, Magliette e categorie custom).
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
          <TabCategorie
            categories={settings.categories ?? []}
            onChange={(v) => patch({ categories: v })}
          />
        )}
        {activeTab === 1 && <TabTemi settings={settings} onChange={patch} />}
        {activeTab === 2 && (
          <TabEventi events={settings.events} onChange={(v) => patch({ events: v })} />
        )}
        {activeTab === 3 && <TabFormatiPrezzi settings={settings} onChange={patch} />}
        {activeTab === 4 && <TabAddon settings={settings} onChange={patch} />}
        {activeTab === 5 && <TabColori settings={settings} onChange={patch} />}
        {activeTab === 6 && <TabImpostazioni settings={settings} onChange={patch} />}
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
