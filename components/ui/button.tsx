"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "px-4 py-2 text-xs",
    size === "md" && "px-5 py-3 text-sm",
    size === "lg" && "px-6 py-3.5 text-sm",
    variant === "primary" &&
      "bg-[var(--color-accent)] text-white shadow-[0_18px_40px_rgba(191,79,123,0.25)] hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)]",
    variant === "secondary" &&
      "border border-[var(--color-line)] bg-white/70 text-[var(--color-foreground)] backdrop-blur hover:border-[var(--color-accent)]",
    variant === "outline" &&
      "border border-[var(--color-line)] bg-transparent text-[var(--color-foreground)] hover:bg-white/70",
    variant === "ghost" &&
      "bg-transparent text-[var(--color-foreground)] hover:bg-white/60",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}