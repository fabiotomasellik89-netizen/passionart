import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <Badge>{eyebrow}</Badge>
      <h2 className="font-display text-4xl leading-none text-[var(--color-foreground)] md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-[var(--color-muted)] md:text-lg">
        {description}
      </p>
    </div>
  );
}
