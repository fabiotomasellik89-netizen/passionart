import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";

export type Review = {
  id: string;
  productSlug: string;
  author: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
};

type ReviewsStore = {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  getProductReviews: (slug: string) => Review[];
  getAverageRating: (slug: string) => number | null;
};

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (data) =>
        set((state) => ({
          reviews: [
            ...state.reviews,
            {
              ...data,
              id: uid("review"),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      getProductReviews: (slug) =>
        get().reviews.filter((r) => r.productSlug === slug),
      getAverageRating: (slug) => {
        const productReviews = get().reviews.filter((r) => r.productSlug === slug);
        if (!productReviews.length) return null;
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / productReviews.length) * 10) / 10;
      },
    }),
    {
      name: "passionart-reviews",
    },
  ),
);
