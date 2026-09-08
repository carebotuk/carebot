import type { Metadata } from "next";
import { getResources } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ResourceCard } from "@/components/site/ResourceCard";
import { ClosingCta } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Resources | Guides and checklists for care and hospitality operators",
  description: "Practical guides, deployment checklists and, as they land, real UK case studies on service robots. Written for operations directors and registered managers, not engineers.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <>
      <Section band="paper" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }]} />
        <div className="mt-8 max-w-3xl">
          <h1>Resources</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            Written for the person who has been asked to look into robots and needs a straight answer. No case studies until we have a real one to show you.
          </p>
        </div>
      </Section>
      <Section band="paper" className="pt-0 sm:pt-0">
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
