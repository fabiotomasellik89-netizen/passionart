import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-line)] bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
