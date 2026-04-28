import { ProductCard } from "@/components/catalog/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

export function ShowcaseGrid({ products }: { products: Product[] }) {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <SectionHeading
          eyebrow="Lavori realizzati"
          title="Ispirazioni reali da cui partire per il tuo progetto."
          description="Scopri esempi di allestimenti, ricordini e set completi già immaginati per nascita, battesimo, comunione e matrimonio."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
