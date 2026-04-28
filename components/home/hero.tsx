import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <Badge>Collezione 2026 • Artigianale • Personalizzabile</Badge>
          <div className="space-y-5">
            <h1 className="font-display text-5xl leading-[0.95] text-[var(--color-foreground)] md:text-7xl">
              Bomboniere e dettagli che trasformano un ricordo in emozione.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              PassionArt firma piccoli oggetti da custodire: legno, incisioni,
              palette romantiche e un configuratore pensato per creare un pezzo
              davvero tuo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/configuratore">
              <Button>Personalizza ora</Button>
            </Link>
            <Link href="/catalogo">
              <Button variant="secondary">Scopri il catalogo</Button>
            </Link>
          </div>
          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ["+120", "ordini creativi demo"],
              ["6", "forme configurabili"],
              ["48h", "bozza ordine pronta"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[1.75rem] border border-[var(--color-line)] bg-white/65 px-5 py-4"
              >
                <p className="font-display text-3xl text-[var(--color-foreground)]">
                  {value}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -rotate-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%),linear-gradient(135deg,#f5c0d2,transparent_45%),linear-gradient(320deg,#f6efe4,transparent_60%)] blur-2xl" />
          <div className="relative rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(250,235,229,0.82))] p-6 shadow-[0_32px_90px_rgba(163,102,119,0.18)]">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Nascita",
                  subtitle: "Cuore inciso, fiocco cipria, legno chiaro",
                  color: "from-[#f5d0db] to-[#f8f0e5]",
                },
                {
                  title: "Matrimonio",
                  subtitle: "Tag eleganti, tavola coordinata, palette crema",
                  color: "from-[#f2ebdf] to-[#ecc2d2]",
                },
                {
                  title: "Comunione",
                  subtitle: "Stelle luminose, simboli delicati, incisioni pulite",
                  color: "from-[#f9f0e8] to-[#e8bed0]",
                },
                {
                  title: "Battesimo",
                  subtitle: "Casette dolci, nastri soft-touch, set coordinati",
                  color: "from-[#f7e4ea] to-[#f4efe5]",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-[2rem] border border-white/70 bg-gradient-to-br ${card.color} p-5`}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    {card.title}
                  </p>
                  <p className="mt-14 font-display text-3xl text-[var(--color-foreground)]">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {card.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
