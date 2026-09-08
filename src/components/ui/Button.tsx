import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const base =
  "group inline-flex items-center justify-center gap-3 rounded-full font-medium transition-colors duration-200 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";
const sizes = { md: "h-12 pl-6 pr-2 text-(length:--step-0)", sm: "h-10 pl-5 pr-1.5 text-(length:--step--1)" };
const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-[#33322f]",
  secondary: "bg-paper text-ink border border-stone hover:border-ink",
  ghost: "bg-transparent text-ink hover:bg-mist",
  inverse: "bg-paper text-ink hover:bg-mist",
};
const arrowBg: Record<Variant, string> = {
  primary: "bg-paper text-ink",
  secondary: "bg-ink text-paper",
  ghost: "bg-ink text-paper",
  inverse: "bg-ink text-paper",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h11M10 5l5 5-5 5" />
    </svg>
  );
}

type Common = { variant?: Variant; size?: "md" | "sm"; children: ReactNode; className?: string; full?: boolean };

export function ButtonLink({ href, variant = "primary", size = "md", children, className = "", full, ...rest }: Common & Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""} ${className}`} {...rest}>
      <span>{children}</span>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${arrowBg[variant]} ${size === "sm" ? "h-7 w-7" : ""}`}>
        <Arrow />
      </span>
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", children, className = "", full, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""} ${className}`} {...rest}>
      <span>{children}</span>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${arrowBg[variant]} ${size === "sm" ? "h-7 w-7" : ""}`}>
        <Arrow />
      </span>
    </button>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-1.5 font-medium text-accent underline-offset-4 hover:underline ${className}`}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M10 5l5 5-5 5" /></svg>
    </Link>
  );
}
