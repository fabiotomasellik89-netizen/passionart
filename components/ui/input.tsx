import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const baseInputClassName =
  "w-full rounded-2xl border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(191,79,123,0.12)]";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-foreground)]">
      {label ? <span>{label}</span> : null}
      <input ref={ref} className={cn(baseInputClassName, className)} {...props} />
      {error ? <span className="text-xs text-[var(--color-error)]">{error}</span> : null}
    </label>
  ),
);

Input.displayName = "Input";