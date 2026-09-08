import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies, getIndustries, getIndustry, getProductsForIndustry, getResource } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { Stat } from "@/components/ui/Stat";
import { ProductCard } from "@/components/site/ProductCard";
import { ResourceCard } from "@/components/site/ResourceCard";
import { ClosingCta, DemoBlock } from "@/components/site/Blocks";

export async function generateStaticParams() {
  return (await getIndustries()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const i = await getIndustry(slug);
  if (!i) return {};
  return pageMetadata({ title: i.seo.title ?? `${i.name} | ${i.headline}`, description: i.seo.description ?? i.intro, path: `/industries/${i.slug}`, ogImage: i.seo.ogImage });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry || industry.status !== "live") notFound();
  const [products, caseStudies, resource] = await Promise.all([
    getProductsForIndustry(industry),
    getCaseStudies(),
    industry.gatedResource ? getResource(industry.gatedResource) : Promise.resolve(undefined),
  ]);
  const related = caseStudies.filter((c) => c.industry === industry.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Service robots for ${industry.name.toLowerCase()}`,
      description: industry.intro,
      provider: { "@id": absoluteUrl("/#organization") },
      areaServed: "GB",
      url: absoluteUrl(`/industries/${industry.slug}`),
    },
    industry.faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: industry.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }
      : null,
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: industry.name, href: `/industries/${industry.slug}` }]} />
        <div className="mt-8 max-w-3xl">
          <p className="text-slate">{industry.name}</p>
          <h1 className="mt-3">{industry.headline}</h1>
          <p className="mt-6 text-(length:--step-1) text-slate">{industry.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/contact?enquiry=survey&industry=${industry.slug}`}>Book a site survey</ButtonLink>
            <ButtonLink href="/demo" variant="secondary">Visit Northfleet</ButtonLink>
          </div>
        </div>
      </Section>

      <Section band="mist">
        <div className="prose" dangerouslySetInnerHTML={{ __html: industry.html }} />
      </Section>

      {industry.outcomes.length ? (
        <Section band="paper" ariaLabelledBy="outcomes-heading">
          <h2 id="outcomes-heading" className="mb-10">Outcomes</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {industry.outcomes.map((o) => <Stat key={o.label} value={o.metric} label={o.label} source={o.source} />)}
          </div>
        </Section>
      ) : null}

      {products.length ? (
        <Section band="paper" ariaLabelledBy="rec-heading">
          <h2 id="rec-heading" className="mb-8">Recommended robots</h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <li key={p.slug}><ProductCard product={p} /></li>)}
          </ul>
        </Section>
      ) : null}

      <Section band="mist" ariaLabelledBy="evidence-heading">
        <h2 id="evidence-heading" className="mb-4">{related.length ? "Case studies" : "Before the case studies"}</h2>
        {related.length ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {related.map((c) => (
              <li key={c.slug} className="rounded-[var(--radius)] bg-paper p-6">
                <h3>{c.title}</h3>
                <p className="mt-2 text-slate">{c.client}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <p className="max-w-xl text-slate">
              We are new, and we will not publish a case study until there is a real UK deployment behind it. In the meantime we have written a guide for the person weighing this up, and we will put a robot in front of you in Kent.
            </p>
            {resource ? <ResourceCard resource={resource} /> : null}
          </div>
        )}
      </Section>

      {industry.faqs.length ? <Section band="paper"><Faq items={industry.faqs} /></Section> : null}

      <DemoBlock />
      <ClosingCta />
    </>
  );
}
