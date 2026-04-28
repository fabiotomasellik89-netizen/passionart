"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/field";

const CATEGORY_LABELS: Record<string, string> = {
  bomboniere: "Bomboniere",
  segnaposto: "Segnaposto",
  ricordini: "Ricordini",
  decorazioni: "Decorazioni",
  "set-regalo": "Set regalo",
  collezione: "Collezione",
  tazze: "Tazze personalizzate",
  magliette: "Magliette e polo",
  "tele-stampate": "Tele stampate UV",
};

const EVENT_LABELS: Record<string, string> = {
  matrimonio: "Matrimonio",
  battesimo: "Battesimo",
  comunione: "Comunione",
  nascita: "Nascita",
  compleanno: "Compleanno",
  pasqua: "Pasqua",
  anniversario: "Anniversario",
};

export function FilterBar({
  categories,
  events,
}: {
  categories: string[];
  events: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = useMemo(
    () => ({
      category: searchParams.get("category") || "all",
      event: searchParams.get("event") || "all",
      type: searchParams.get("type") || "all",
    }),
    [searchParams],
  );

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-5 md:grid-cols-3">
      <Select
        value={current.category}
        onChange={(event) => update("category", event.target.value)}
      >
        <option value="all">Tutte le categorie</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {CATEGORY_LABELS[category] ?? category}
          </option>
        ))}
      </Select>
      <Select value={current.event} onChange={(event) => update("event", event.target.value)}>
        <option value="all">Tutti gli eventi</option>
        {events.map((item) => (
          <option key={item} value={item}>
            {EVENT_LABELS[item] ?? item}
          </option>
        ))}
      </Select>
      <Select value={current.type} onChange={(event) => update("type", event.target.value)}>
        <option value="all">Tutti i tipi</option>
        <option value="custom">Personalizzabili</option>
        <option value="ready">Pronti da ordinare</option>
        <option value="showcase">Lavori realizzati</option>
      </Select>
    </div>
  );
}
