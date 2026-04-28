"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "passionart_discount_popup_seen";

export function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(COOKIE_KEY);
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    localStorage.setItem(COOKIE_KEY, "1");
    setVisible(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    localStorage.setItem(COOKIE_KEY, "1");
    setTimeout(() => {
      setVisible(false);
    }, 2500);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Offerta di benvenuto"
    >
      <div
        className="absolute inset-0 bg-[var(--color-foreground)]/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/70 bg-[var(--color-surface)] shadow-[0_40px_100px_rgba(163,102,119,0.28)]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(244,173,197,0.45),transparent_70%)]" />

        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-8 pb-8 pt-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f5d0db] to-[#f2d6c8] text-3xl shadow-[0_8px_24px_rgba(191,79,123,0.2)]">
            🎁
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Benvenuto
          </p>

          <h2 className="font-display text-4xl leading-tight text-[var(--color-foreground)]">
            10% di sconto
            <br />
            sul tuo primo ordine
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Lasciaci la tua email e ricevi subito il codice sconto riservato ai
            nuovi clienti PassionArt.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                placeholder="la-tua@email.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-[var(--color-line)] bg-white/90 px-5 py-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
              <Button type="submit" className="w-full" size="lg">
                Ricevi il codice sconto
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-[var(--color-line)] bg-white/80 px-6 py-4">
              <p className="font-display text-2xl text-[var(--color-foreground)]">BENVENUTO10</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Copia il codice e usalo al momento del checkout.
              </p>
            </div>
          )}

          <button
            onClick={handleClose}
            className="mt-4 text-xs text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)]"
          >
            No grazie, continua senza sconto
          </button>
        </div>
      </div>
    </div>
  );
}
