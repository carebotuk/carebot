import type { Metadata } from "next";
import { getIndustries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IndustryCard } from "@/components/site/IndustryCard";
import { ClosingCta, DemoBlock } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Industries | Service robots for care homes, hotels, restaurants and retail",
  description: "Where service robots earn their keep in the UK: care homes first, then hotels, restaurants and retail. Honest deployment guidance for each setting from Carebot UK.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <Section band="paper" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }]} />
        <div className="mt-8 max-w-3xl">
          <h1>Where the robots work</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            Care homes are where we lead. Hotels, restaurants and retail are well proven and fully supported. Each page describes the problem in your language, what deployment looks like in your building, and what we will not claim.
          </p>
        </div>
      </Section>
      <Section band="paper" className="pt-0 sm:pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
        </div>
      </Section>
      <DemoBlock />
      <ClosingCta />
    </>
  );
}
