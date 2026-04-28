"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Star, Trash2, Upload } from "lucide-react";
import { uid } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ImageUploaderProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.size > 0);
    if (!list.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of list) formData.append("files", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = (await res.json()) as { uploaded: { url: string }[] };
      const hasCover = value.some((img) => img.isCover);
      const newImages: ProductImage[] = json.uploaded.map((item, i) => ({
        id: uid("img"),
        url: item.url,
        alt: "",
        isCover: !hasCover && i === 0 && value.length === 0,
        sortOrder: value.length + i,
      }));
      onChange([...value, ...newImages]);
    } finally {
      setUploading(false);
    }
  }

  function setCover(id: string) {
    onChange(value.map((img) => ({ ...img, isCover: img.id === id })));
  }

  function remove(id: string) {
    const next = value.filter((img) => img.id !== id);
    if (next.length > 0 && !next.some((img) => img.isCover)) {
      next[0] = { ...next[0], isCover: true };
    }
    onChange(next);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  function updateAlt(id: string, alt: string) {
    onChange(value.map((img) => (img.id === id ? { ...img, alt } : img)));
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 transition-colors",
          dragOver
            ? "border-[var(--color-accent)] bg-[rgba(191,79,123,0.05)]"
            : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50",
          uploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void uploadFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="h-6 w-6 text-[var(--color-muted)]" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          {uploading ? "Caricamento in corso…" : "Trascina qui le foto oppure clicca per scegliere"}
        </p>
        <p className="text-xs text-[var(--color-muted)]">JPEG · PNG · WebP — max 10 MB per file</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Gallery */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((img, i) => (
            <div
              key={img.id}
              className={[
                "overflow-hidden rounded-2xl border-2 transition-colors",
                img.isCover
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-line)]",
              ].join(" ")}
            >
              {/* Thumbnail */}
              <div className="relative h-28 w-full bg-[var(--color-surface-strong)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || "Anteprima"}
                  className="h-full w-full object-cover"
                />
                {img.isCover && (
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    <Star className="h-2.5 w-2.5" />
                    Copertina
                  </div>
                )}
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-1 px-2 pt-2">
                {!img.isCover && (
                  <button
                    type="button"
                    title="Imposta come copertina"
                    onClick={() => setCover(img.id)}
                    className="flex items-center gap-1 rounded-full border border-[var(--color-line)] px-2 py-1 text-[10px] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <Star className="h-3 w-3" />
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  title="Sposta su"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="rounded-full border border-[var(--color-line)] p-1 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] disabled:opacity-30"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  title="Sposta giù"
                  onClick={() => moveDown(i)}
                  disabled={i === value.length - 1}
                  className="rounded-full border border-[var(--color-line)] p-1 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  title="Elimina immagine"
                  onClick={() => remove(img.id)}
                  className="ml-auto rounded-full border border-[var(--color-line)] p-1 text-[var(--color-muted)] transition hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Alt text */}
              <div className="px-2 pb-2 pt-1">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => updateAlt(img.id, e.target.value)}
                  placeholder="Testo alternativo…"
                  className="w-full rounded-lg border border-[var(--color-line)] bg-white/90 px-2 py-1 text-xs text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
