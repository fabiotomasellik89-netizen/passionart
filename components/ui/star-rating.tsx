"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-colors duration-150",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
          )}
          aria-label={`${star} stelle`}
        >
          <Star
            className={cn(
              starSize,
              star <= value
                ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
                : "fill-none text-[var(--color-line)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}
