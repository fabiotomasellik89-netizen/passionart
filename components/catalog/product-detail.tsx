import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { ProductReviews } from "@/components/catalog/product-reviews";
import { ProductOptionsPanel } from "@/components/catalog/product-options";
import { euro } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const cover = product.images.find((image) => image.isCover) ?? product.images[0];

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="relative min-h-[26rem] overflow-hidden rounded-[2.5rem] border border-[var(--color-line)]"
          style={{
            background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`,
          }}
        >
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </div>
        <Card className="space-y-6 p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.badge}</Badge>
            <Badge>{product.eventType}</Badge>
            <Badge>{product.category}</Badge>
            <div className="ml-auto">
              <WishlistButton slug={product.slug} />
            </div>
          </div>
          <div>
            <h1 className="font-display text-5xl leading-none text-[var(--color-foreground)]">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
              {product.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--color-surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Prezzo iniziale
              </p>
              <p className="mt-2 text-2xl font-semibold">{euro(product.basePrice)}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--color-surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Tempi di produzione
              </p>
              <p className="mt-2 text-2xl font-semibold">{product.leadTimeDays} giorni</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Materiali
            </p>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((material) => (
                <Badge key={material}>{material}</Badge>
              ))}
            </div>
          </div>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {product.productionNotes}
          </p>
          <div className="flex flex-wrap gap-3">
            {product.category === "tazze" || product.category === "magliette" ? (
              <ProductOptionsPanel product={product} />
            ) : product.category === "tele-stampate" ? (
              <Link href={`/catalogo/${product.slug}/configura-tela`}>
                <Button>Personalizza la tela</Button>
              </Link>
            ) : product.isCustomizable ? (
              <Link href={`/catalogo/${product.slug}/configura`}>
                <Button>Configura questo articolo</Button>
              </Link>
            ) : null}
            {product.category !== "tazze" && product.category !== "magliette" && (
              <Link href="/catalogo">
                <Button variant="secondary">Torna al catalogo</Button>
              </Link>
            )}
          </div>
        </Card>
      </section>

      <ProductReviews productSlug={product.slug} />

      <section className="space-y-5">
        <h2 className="font-display text-4xl text-[var(--color-foreground)]">
          Potrebbe piacerti anche
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {related.map((item) => (
            <Card key={item.id} className="space-y-3">
              <p className="font-display text-2xl text-[var(--color-foreground)]">{item.name}</p>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                {item.shortDescription}
              </p>
              <Link
                href={`/catalogo/${item.slug}`}
                className="inline-flex text-sm font-semibold text-[var(--color-accent)]"
              >
                Apri scheda
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
