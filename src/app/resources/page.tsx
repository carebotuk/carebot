import type { Metadata } from "next";
import { getResources } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ResourceCard } from "@/components/site/ResourceCard";
import { ClosingCta } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Resources | Guides and checklists for care and hospitality operators",
  description: "Guides and checklists to help business owners and managers assess service robots, prepare their premises and ask the right questions.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <>
      <Section band="sage" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="mb-4 text-sm font-medium text-accent">Plan your next step</p>
          <h1>What to know before buying a robot.</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            Compare the jobs a robot can do, understand the building requirements and prepare your questions about cost and support. Our guides are being prepared; register your interest or contact us for advice now.
          </p>
        </div>
      </Section>
      <Section band="sage" className="pt-0 sm:pt-0">
        {resources.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => <ResourceCard key={r.slug} resource={r} />)}
          </div>
        ) : (
          <p className="text-slate">Nothing published yet.</p>
        )}
      </Section>
      <ClosingCta />
    </>
  );
}
