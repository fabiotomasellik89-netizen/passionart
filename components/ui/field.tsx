import { cn } from "@/lib/utils";
import * as React from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-foreground)]">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

export const inputClassName =
  "w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClassName, props.className)} {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClassName, "min-h-28 resize-y", props.className)} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClassName, props.className)} {...props} />;
}
