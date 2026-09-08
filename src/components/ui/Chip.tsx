import type { ReactNode } from "react";
export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "alert" }) {
  const cls =
    tone === "accent"
      ? "border-accent/30 text-accent"
      : tone === "alert"
        ? "border-alert/40 text-alert"
        : "border-stone text-slate";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-(length:--step--1) leading-tight ${cls}`}>{children}</span>;
}
