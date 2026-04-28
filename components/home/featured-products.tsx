import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selezione in evidenza"
            title="Le creazioni più amate per celebrare i momenti belli."
            description="Ogni articolo nasce da una palette calda, materiali semplici e una cura artigianale che si vede da vicino."
          />
          <Link href="/catalogo">
            <Button variant="secondary">Vai al catalogo completo</Button>
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
