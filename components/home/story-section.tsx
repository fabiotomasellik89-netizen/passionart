import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";

export function StorySection() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading
          eyebrow="Chi siamo"
          title="Un piccolo laboratorio creativo che ama i dettagli gentili."
          description="PassionArt nasce per rendere tangibili i ricordi. Lavoriamo con forme simboliche, incisioni delicate e confezioni coordinate per dare carattere a ogni evento."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Palette calde ispirate al legno chiaro, al cipria e al fucsia del brand.",
            "Anteprima live della personalizzazione prima di inviare l'ordine.",
            "Set completi con confetti, veli e packaging per una regia coerente.",
            "Area admin per aggiornare catalogo, lavori realizzati e ordini.",
          ].map((item) => (
            <Card key={item} className="min-h-36">
              <p className="text-base leading-7 text-[var(--color-muted)]">{item}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
