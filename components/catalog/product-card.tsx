"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { StarRating } from "@/components/ui/star-rating";
import { euro } from "@/lib/utils";
import { useReviewsStore } from "@/store/reviews-store";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images.find((image) => image.isCover) ?? product.images[0];

  // Subscribe to the raw array — stable reference, only changes when a review is added/removed.
  // Calling getProductReviews() inside a selector would return a new array on every invocation
  // (filter always allocates), making Zustand think state changed → infinite render loop.
  const allReviews = useReviewsStore((state) => state.reviews);

  const reviews = useMemo(
    () => allReviews.filter((r) => r.productSlug === product.slug),
    [allReviews, product.slug],
  );

  const avg = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  return (
    <Card className="group overflow-hidden p-0">
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
          {product.isCustomizable ? <Badge>personalizzabile</Badge> : null}
        </div>
        <div>
          <h3 className="font-display text-3xl text-[var(--color-foreground)]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            {product.shortDescription}
          </p>
          {avg !== null ? (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={Math.round(avg)} readonly size="sm" />
              <span className="text-xs text-[var(--color-muted)]">
                {avg.toFixed(1)} ({reviews.length})
              </span>
            </div>
          ) : null}
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
}
