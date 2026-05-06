"use client";

import { useMemo, useState } from "react";
import { Edit2, Images, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { euro, slugify } from "@/lib/utils";
import type { Product, ProductCategory, ProductImage } from "@/types";

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "bomboniere", label: "Bomboniere" },
  { value: "segnaposto", label: "Segnaposto" },
  { value: "ricordini", label: "Ricordini" },
  { value: "decorazioni", label: "Decorazioni" },
  { value: "set-regalo", label: "Set regalo" },
  { value: "collezione", label: "Collezione" },
  { value: "tazze", label: "Tazze personalizzate" },
  { value: "magliette", label: "Magliette e polo" },
  { value: "tele-stampate", label: "Calamite"},
  { value: "tele-stampate", label: "Tele stampate UV" },
];

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  basePrice: 9.9,
  category: "bomboniere" as ProductCategory,
  images: [] as ProductImage[],
};

type FormState = typeof emptyForm;

export default function AdminProdottiPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const title = useMemo(() => (form.id ? "Modifica prodotto" : "Nuovo prodotto"), [form.id]);

  if (!hasLoaded) {
    setHasLoaded(true);
    fetch("/api/admin/products")
      .then((response) => response.json())
      .then((json: { products: Product[] }) => setProducts(json.products))
      .catch(() => undefined);
  }

  async function submit() {
    setSaving(true);
    await fetch(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || slugify(form.name),
        images: form.images,
      }),
    });
    setForm(emptyForm);
    setSaving(false);
    const response = await fetch("/api/admin/products");
    const json = (await response.json()) as { products: Product[] };
    setProducts(json.products);
  }

  async function remove(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const response = await fetch("/api/admin/products");
    const json = (await response.json()) as { products: Product[] };
    setProducts(json.products);
  }

  function startEdit(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      images: product.images ?? [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      {/* ── Form ── */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[var(--color-surface-strong)] p-3">
            {form.id ? (
              <Edit2 className="h-4 w-4 text-[var(--color-accent)]" />
            ) : (
              <Plus className="h-4 w-4 text-[var(--color-accent)]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">{title}</p>
            <p className="text-sm text-[var(--color-muted)]">
              Aggiorna rapidamente il catalogo demo e la vetrina dello storefront.
            </p>
          </div>
        </div>

        <Input
          label="Nome"
          value={form.name}
          onChange={(e) =>
            setForm((cur) => ({
              ...cur,
              name: e.target.value,
              slug: cur.id ? cur.slug : slugify(e.target.value),
            }))
          }
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => setForm((cur) => ({ ...cur, slug: e.target.value }))}
        />
        <Input
          label="Descrizione breve"
          value={form.shortDescription}
          onChange={(e) => setForm((cur) => ({ ...cur, shortDescription: e.target.value }))}
        />
        <Input
          label="Descrizione estesa"
          value={form.description}
          onChange={(e) => setForm((cur) => ({ ...cur, description: e.target.value }))}
        />
        <Input
          label="Prezzo base"
          type="number"
          step="0.1"
          value={form.basePrice}
          onChange={(e) => setForm((cur) => ({ ...cur, basePrice: Number(e.target.value) }))}
        />

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Categoria</p>
          <Select
            value={form.category}
            onChange={(e) =>
              setForm((cur) => ({ ...cur, category: e.target.value as ProductCategory }))
            }
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Image upload section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Images className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              Immagini prodotto
            </span>
            {form.images.length > 0 && (
              <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
                {form.images.length} foto
              </span>
            )}
          </div>
          <ImageUploader
            value={form.images}
            onChange={(images) => setForm((cur) => ({ ...cur, images }))}
          />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" onClick={submit} disabled={saving || !form.name}>
            <Save className="h-4 w-4" />
            {saving ? "Salvataggio…" : "Salva prodotto"}
          </Button>
          {form.id && (
            <Button variant="outline" onClick={() => setForm(emptyForm)}>
              Annulla
            </Button>
          )}
        </div>
      </Card>

      {/* ── Product list ── */}
      <div className="space-y-4">
        {products.map((product) => {
          const cover = product.images?.find((img) => img.isCover) ?? product.images?.[0];
          return (
            <Card key={product.id} className="space-y-4">
              <div className="flex items-start gap-4">
                {cover && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover.url}
                      alt={cover.alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">
                        {product.shortDescription}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold text-[var(--color-accent)]">
                      {euro(product.basePrice)}
                    </p>
                  </div>
                  {product.images && product.images.length > 0 && (
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {product.images.length} {product.images.length === 1 ? "foto" : "foto"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => startEdit(product)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(product.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
