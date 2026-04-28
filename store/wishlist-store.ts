import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  items: string[]; // product slugs
  toggle: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (slug) =>
        set((state) => ({
          items: state.items.includes(slug)
            ? state.items.filter((s) => s !== slug)
            : [...state.items, slug],
        })),
      isWishlisted: (slug) => get().items.includes(slug),
      clear: () => set({ items: [] }),
    }),
    {
      name: "passionart-wishlist",
    },
  ),
);
