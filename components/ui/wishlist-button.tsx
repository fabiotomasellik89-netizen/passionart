"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function WishlistButton({ slug }: { slug: string }) {
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={wishlisted ? "Rimuovi dalla wishlist" : "Aggiungi alla wishlist"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
        wishlisted
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-[var(--color-line)] bg-white/80 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
      )}
    >
      <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
