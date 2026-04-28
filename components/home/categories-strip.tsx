import { Card } from "@/components/ui/card";

const categories = [
  "Bomboniere in legno inciso",
  "Segnaposto per eventi",
  "Ricordini da appendere",
  "Decorazioni coordinate",
];

export function CategoriesStrip() {
  return (
    <section className="px-5 py-8 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Card key={category} className="p-5">
            <p className="font-medium text-[var(--color-foreground)]">{category}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
