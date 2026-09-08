import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustry, getResource, getResources } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { JsonLd } from "@/components/ui/JsonLd";
import { ResourceRequestForm } from "@/components/forms/ResourceRequestForm";
import { ClosingCta } from "@/components/site/Blocks";

export async function generateStaticParams() {
  return (await getResources()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await getResource(slug);
  if (!r) return {};
  return pageMetadata({ title: r.seo.title ?? r.title, description: r.seo.description ?? r.summary, path: `/resources/${r.slug}`, ogImage: r.seo.ogImage ?? r.coverImage });
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) notFound();
  const industry = resource.industry ? await getIndustry(resource.industry) : undefined;
  const available = Boolean(resource.asset) && resource.status === "live";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.title,
          description: resource.summary,
          datePublished: resource.publishedAt,
          author: { "@id": absoluteUrl("/#organization") },
          publisher: { "@id": absoluteUrl("/#organization") },
          url: absoluteUrl(`/resources/${resource.slug}`),
        }}
      />
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: resource.title, href: `/resources/${resource.slug}` }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <Chip>{resource.resourceType === "case-study" ? "Case study" : resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}</Chip>
              {industry ? <Chip>{industry.name}</Chip> : null}
              {!available ? <Chip tone="accent">Coming soon</Chip> : null}
            </div>
            <h1 className="mt-5">{resource.title}</h1>
            <p className="mt-6 text-(length:--step-1) text-slate">{resource.summary}</p>
            <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: resource.html }} />
            {!resource.isGated && resource.asset ? (
              <div className="mt-8"><ButtonLink href={resource.asset} target="_blank" rel="noopener">Download</ButtonLink></div>
            ) : null}
          </div>
          {resource.isGated ? (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ResourceRequestForm
                resourceSlug={resource.slug}
                heading={resource.formHeading ?? "Get it by email"}
                available={available}
                defaultIndustry={industry?.slug as "care-homes" | "hotels" | "restaurants" | "retail" | undefined}
              />
            </div>
          ) : null}
        </div>
      </Section>
      <ClosingCta />
    </>
  );
}
