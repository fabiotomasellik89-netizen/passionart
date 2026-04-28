"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useReviewsStore } from "@/store/reviews-store";
import { StarRating } from "@/components/ui/star-rating";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const { addReview, getProductReviews, getAverageRating } = useReviewsStore();
  const reviews = getProductReviews(productSlug);
  const avg = getAverageRating(productSlug);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim()) {
      setError("Inserisci il tuo nome.");
      return;
    }
    if (!text.trim()) {
      setError("Scrivi un breve commento.");
      return;
    }
    addReview({ productSlug, author: author.trim(), rating, text: text.trim() });
    setAuthor("");
    setRating(5);
    setText("");
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-4xl text-[var(--color-foreground)]">
          Recensioni clienti
        </h2>
        {avg !== null ? (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avg)} readonly size="sm" />
            <span className="text-sm text-[var(--color-muted)]">
              {avg.toFixed(1)} su 5 ({reviews.length} recensioni)
            </span>
          </div>
        ) : null}
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{review.author}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {new Date(review.createdAt).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              <p className="text-sm leading-7 text-[var(--color-muted)]">{review.text}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[1.5rem] bg-[var(--color-surface)] px-5 py-4 text-sm text-[var(--color-muted)]">
          <MessageSquare className="h-4 w-4 shrink-0" />
          Nessuna recensione ancora. Sii il primo a condividere la tua esperienza!
        </div>
      )}

      <Card className="space-y-5">
        <h3 className="font-display text-3xl text-[var(--color-foreground)]">
          Lascia una recensione
        </h3>
        {submitted ? (
          <div className="rounded-[1.5rem] bg-[rgba(47,155,99,0.1)] px-4 py-3 text-sm text-[var(--color-success)]">
            Grazie per la tua recensione!
          </div>
        ) : null}
        {error ? (
          <div className="rounded-[1.5rem] bg-[rgba(193,79,88,0.08)] px-4 py-3 text-sm text-[var(--color-error)]">
            {error}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Valutazione
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <Field label="Il tuo nome">
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Es. Maria R."
            />
          </Field>
          <Field label="Commento">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Condividi la tua esperienza con questo prodotto…"
            />
          </Field>
          <Button type="submit" size="md">
            Pubblica recensione
          </Button>
        </form>
      </Card>
    </section>
  );
}
