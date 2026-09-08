import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function LegalPage({ title, href, updated, children }: { title: string; href: string; updated: string; children: ReactNode }) {
  return (
    <Section band="paper">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title, href }]} />
      <h1 className="mt-8">{title}</h1>
      <p className="mt-3 text-slate">Last updated {updated}.</p>
      <div className="prose mt-10">{children}</div>
    </Section>
  );
}
