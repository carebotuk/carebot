import type { Metadata } from "next";
import { getIndustries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IndustryCard } from "@/components/site/IndustryCard";
import { DemoBlock } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Industries | Service robots for care homes, hospitals, hotels, restaurants and retail",
  description: "Explore service robots for hotels, restaurants, retail, care homes and hospitals. Practical applications and UK deployment support for each setting.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <Section band="sage" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="mb-4 text-sm font-medium text-accent">Your business. Your use case.</p>
          <h1>Service robots for your business.</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            A restaurant needs help with plate runs. A care home may need linen delivered upstairs. A hospital needs everyday supplies moved between departments. A hotel needs towels taken to a guest. Choose your sector to see the relevant robots, how they are used and what an installation involves.
          </p>
        </div>
      </Section>
      <Section band="sage" className="pt-0 sm:pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
        </div>
      </Section>
      <DemoBlock />
    </>
  );
}
