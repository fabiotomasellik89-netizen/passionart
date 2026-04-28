"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Images, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import type { EventType, Product, ProductImage } from "@/types";

const emptyForm = {
  id: "",
  name: "",
  description: "",
  eventType: "nascita" as EventType,
  images: [] as ProductImage[],
};

type FormState = typeof emptyForm;

export default function AdminLavoriRealizzatiPage() {
  const [works, setWorks] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<Record<string, ProductImage[]>>({});
  const [savingImages, setSavingImages] = useState<string | null>(null);

  const title = useMemo(() => (form.id ? "Modifica lavoro" : "Nuovo lavoro realizzato"), [form.id]);

  async function loadWorks() {
    const res = await fetch("/api/admin/products");
    const json = (await res.json()) as { products: Product[] };
    setWorks(
      json.products.filter(
        (p) => p.inspirationType === "showcase" || p.inspirationType === "both",
      ),
    );
  }

  useEffect(() => {
    loadWorks().catch(() => undefined);
  }, []);

  async function submit() {
    setSaving(true);
    const slug = form.id
      ? works.find((w) => w.id === form.id)?.slug ?? slugify(form.name)
      : slugify(form.name);

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.description,
      eventType: form.eventType,
      inspirationType: "showcase",
      slug,
      images: form.images,
    };

    await fetch(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyForm);
    setSaving(false);
    await loadWorks();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await loadWorks();
  }

  async function saveImages(workId: string) {
    const images = editImages[workId];
    if (!images) return;
    setSavingImages(workId);
    await fetch(`/api/admin/products/${workId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    setSavingImages(null);
    setExpandedId(null);
    await loadWorks();
  }

  function startEdit(work: Product) {
    setForm({
      id: work.id,
      name: work.name,
      description: work.description,
      eventType: work.eventType,
      images: work.images ?? [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleImageEditor(work: Product) {
    if (expandedId === work.id) {
      setExpandedId(null);
    } else {
      setExpandedId(work.id);
      setEditImages((prev) => ({ ...prev, [work.id]: work.images ?? [] }));
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Lavori realizzati
        </p>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          Vetrina d'ispirazione
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* ── Form ── */}
        <Card className="space-y-4 self-start">
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
                I lavori aggiunti qui appaiono nella vetrina d'ispirazione.
              </p>
            </div>
          </div>

          <Input
            label="Titolo"
            value={form.name}
            onChange={(e) => setForm((cur) => ({ ...cur, name: e.target.value }))}
          />
          <Input
            label="Descrizione"
            value={form.description}
            onChange={(e) => setForm((cur) => ({ ...cur, description: e.target.value }))}
          />

          <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-foreground)]">
            <span>Tipo evento</span>
            <select
              value={form.eventType}
              onChange={(e) =>
                setForm((cur) => ({ ...cur, eventType: e.target.value as EventType }))
              }
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]"
            >
              {(
                [
                  "nascita",
                  "battesimo",
                  "compleanno",
                  "comunione",
                  "matrimonio",
                  "anniversario",
                  "pasqua",
                ] as EventType[]
              ).map((et) => (
                <option key={et} value={et}>
                  {et.charAt(0).toUpperCase() + et.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {/* Image upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Images className="h-4 w-4 text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Immagini</span>
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
              {saving ? "Salvataggio…" : "Salva lavoro"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={() => setForm(emptyForm)}>
                Annulla
              </Button>
            )}
          </div>
        </Card>

        {/* ── Works list ── */}
        <div className="space-y-5">
          {works.map((work) => {
            const cover =
              work.images?.find((img) => img.isCover) ?? work.images?.[0];
            const isExpanded = expandedId === work.id;

            return (
              <Card key={work.id} className="overflow-hidden p-0">
                {cover ? (
                  <div className="relative h-48 bg-[var(--color-surface)]">
                    <Image
                      src={cover.url}
                      alt={cover.alt || work.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-[var(--color-surface-strong)]">
                    <p className="text-sm text-[var(--color-muted)]">Nessuna immagine</p>
                  </div>
                )}

                <div className="space-y-3 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    <Sparkles className="h-3 w-3" />
                    {work.eventType}
                  </div>
                  <h2 className="font-display text-3xl text-[var(--color-foreground)]">
                    {work.name}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">{work.description}</p>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button variant="secondary" size="sm" onClick={() => toggleImageEditor(work)}>
                      <Images className="mr-2 h-4 w-4" />
                      {isExpanded ? "Chiudi immagini" : "Gestisci immagini"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(work)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Modifica
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(work.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Elimina
                    </Button>
                  </div>

                  {/* Inline image editor */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
                      <p className="text-sm font-medium text-[var(--color-foreground)]">
                        Aggiorna le immagini di questo lavoro
                      </p>
                      <ImageUploader
                        value={editImages[work.id] ?? work.images ?? []}
                        onChange={(images) =>
                          setEditImages((prev) => ({ ...prev, [work.id]: images }))
                        }
                      />
                      <Button
                        className="w-full gap-2"
                        onClick={() => saveImages(work.id)}
                        disabled={savingImages === work.id}
                      >
                        <Save className="h-4 w-4" />
                        {savingImages === work.id ? "Salvataggio…" : "Salva immagini"}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
