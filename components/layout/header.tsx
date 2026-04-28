"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { navItems, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const itemsCount = useCartStore((state) => state.items.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(252,247,242,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpeg"
            alt="Logo PassionArt"
            width={56}
            height={56}
            className="rounded-2xl border border-white/70 shadow-lg"
            priority
          />
          <div>
            <p className="font-display text-2xl leading-none text-[var(--color-foreground)]">
              {siteConfig.name}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              {siteConfig.claim}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                pathname === item.href
                  ? "bg-white text-[var(--color-foreground)] shadow-sm"
                  : "text-[var(--color-muted)] hover:bg-white/70 hover:text-[var(--color-foreground)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/wishlist" className="relative hidden md:block">
            <Button variant="secondary" className="gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </Button>
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-xs font-semibold text-white">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link href="/carrello" className="relative hidden md:block">
            <Button variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Carrello
            </Button>
            <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-xs font-semibold text-white">
              {itemsCount}
            </span>
          </Link>
          <button
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Apri menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[var(--color-line)] bg-[rgba(252,247,242,0.95)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-white/75 px-4 py-3 text-sm font-medium text-[var(--color-foreground)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
