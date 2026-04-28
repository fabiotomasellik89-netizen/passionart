import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ordine confermato",
  robots: { index: false, follow: false },
};

export default async function OrdineConfermatoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const order =
    typeof params.order === "string" && params.order.length
      ? params.order
      : "In lavorazione";

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center px-5 py-12 md:px-8">
      <Card className="w-full space-y-6 p-8 text-center md:p-10">
        <div className="mx-auto rounded-full bg-[var(--color-surface-strong)] p-5">
          <CheckCircle2 className="h-10 w-10 text-[var(--color-success)]" />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Ordine confermato
          </p>
          <h1 className="font-display text-5xl text-[var(--color-foreground)]">
            Grazie per aver scelto PassionArt.
          </h1>
        </div>
        <p className="text-base leading-8 text-[var(--color-muted)]">
          Il laboratorio ha ricevuto la tua richiesta e inizierà la preparazione del progetto.
        </p>
        <div className="rounded-[1.75rem] bg-[var(--color-surface)] px-6 py-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Numero ordine
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--color-accent)]">{order}</p>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-white px-5 py-5 text-left">
          <div className="flex items-start gap-3">
            <Package className="mt-1 h-5 w-5 text-[var(--color-accent)]" />
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Riceverai una conferma via email con il riepilogo. In modalità demo il numero
              ordine è stato creato localmente e resta disponibile nell&apos;area admin.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="secondary">
              <Home className="mr-2 h-4 w-4" />
              Torna alla home
            </Button>
          </Link>
          <Link href="/catalogo">
            <Button>Continua a esplorare</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
