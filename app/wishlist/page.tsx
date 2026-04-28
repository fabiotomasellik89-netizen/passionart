"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { euro } from "@/lib/utils";
import { getAllProducts } from "@/lib/catalog";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const allProducts = getAllProducts();
  const wishlisted = allProducts.filter((p) => items.includes(p.slug));

  if (wishlisted.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-5 px-5 py-12 text-center">
        <div className="rounded-full bg-[var(--color-surface-strong)] p-5">
          <Heart className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          La tua wishlist è ancora vuota.
        </h1>
        <p className="max-w-xl text-base leading-8 text-[var(--color-muted)]">
          Sfoglia il catalogo e salva i prodotti che ami con il cuore rosso.
        </p>
        <Link href="/catalogo">
          <Button>Vai al catalogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Wishlist
        </p>
        <h1 className="font-display text-5xl text-[var(--color-foreground)]">
          {wishlisted.length} prodott{wishlisted.length === 1 ? "o" : "i"} salvat{wishlisted.length === 1 ? "o" : "i"}.
        </h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {wishlisted.map((product) => {
          const cover = product.images.find((img) => img.isCover) ?? product.images[0];
          return (
            <Card key={product.id} className="group overflow-hidden p-0">
              <div
                className="relative h-60 overflow-hidden rounded-[2rem] rounded-b-[1.4rem] border-b border-[var(--color-line)]"
                style={{
                  background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]} 50%, ${product.palette[2]})`,
                }}
              >
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute right-3 top-3">
                  <WishlistButton slug={product.slug} />
                </div>
              </div>
              <div className="space-y-5 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{product.eventType}</Badge>
                  <Badge>{product.category}</Badge>
                </div>
                <div>
                  <h3 className="font-display text-3xl text-[var(--color-foreground)]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                      da
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-foreground)]">
                      {euro(product.basePrice)}
                    </p>
                  </div>
                  <Link
                    href={`/catalogo/${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Scopri
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
