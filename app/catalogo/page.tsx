import type { Metadata } from "next";
import { FilterBar } from "@/components/catalog/filter-bar";
import { ProductCard } from "@/components/catalog/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllProducts, getFilterCollections } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Esplora bomboniere, segnaposto e decorazioni personalizzate PassionArt per matrimoni, battesimi, comunioni e nascite.",
  alternates: {
    canonical: `${siteConfig.url}/catalogo`,
  },
  openGraph: {
    title: `Catalogo | ${siteConfig.name}`,
    description:
      "Esplora bomboniere, segnaposto e decorazioni personalizzate PassionArt per matrimoni, battesimi, comunioni e nascite.",
    images: ["/images/logo.jpeg"],
  },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const category = typeof params.category === "string" ? params.category : "all";
  const event = typeof params.event === "string" ? params.event : "all";
  const type = typeof params.type === "string" ? params.type : "all";
  const products = getAllProducts().filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesEvent = event === "all" || product.eventType === event;
    const matchesType =
      type === "all" ||
      (type === "custom" && product.isCustomizable) ||
      (type === "ready" && !product.isCustomizable) ||
      (type === "showcase" &&
        (product.inspirationType === "showcase" || product.inspirationType === "both"));

    return matchesCategory && matchesEvent && matchesType;
  });

  const filters = getFilterCollections();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-10 md:px-8 md:py-14">
      <SectionHeading
        eyebrow="Catalogo PassionArt"
        title="Bomboniere, set e lavori realizzati pronti da esplorare."
        description="Filtra per evento, categoria e tipologia per trovare ispirazioni reali o partire subito con una personalizzazione."
      />
      <FilterBar categories={filters.categories} events={filters.events} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/60 px-6 py-12 text-center text-[var(--color-muted)]">
          Nessun articolo corrisponde ai filtri selezionati.
        </div>
      ) : null}
    </div>
  );
}
