import type { ReactNode } from "react";
import { Container } from "./Container";

type Props = {
  children: ReactNode;
  band?: "paper" | "mist" | "ink";
  id?: string;
  className?: string;
  narrow?: boolean;
  ariaLabelledBy?: string;
};

/** Alternating section bands with generous vertical rhythm. */
export function Section({ children, band = "paper", id, className = "", ariaLabelledBy }: Props) {
  const bg =
    band === "mist" ? "bg-mist" : band === "ink" ? "bg-ink text-paper" : "bg-paper";
  return (
    <section id={id} aria-labelledby={ariaLabelledBy} className={`${bg} py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  lede,
  kicker,
}: {
  id?: string;
  title: string;
  lede?: string;
  kicker?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl sm:mb-14">
      {kicker ? <p className="mb-3 text-(length:--step--1) text-slate">{kicker}</p> : null}
      <h2 id={id}>{title}</h2>
      {lede ? <p className="mt-4 text-(length:--step-1) text-slate">{lede}</p> : null}
    </div>
  );
}
