import type { Metadata } from "next";
import { getIndustries, getProducts, getResources } from "@/lib/content";
import { pageMetadata, websiteJsonLd } from "@/lib/seo";
import { resolveImage } from "@/lib/images";
import { site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductCard } from "@/components/site/ProductCard";
import { IndustryCard } from "@/components/site/IndustryCard";
import { ResourceCard } from "@/components/site/ResourceCard";
import { ClosingCta, DemoBlock, SupportStrip, TrustStrip } from "@/components/site/Blocks";
import { ProductGrid } from "@/components/site/ProductGrid";

export const metadata: Metadata = pageMetadata({
  title: "Service robots for care homes, hotels and hospitality | Carebot UK",
  description: site.tagline,
  path: "/",
});

const problems = [
  { title: "Staff shortages and agency spend", body: "Vacancies stay open for months and agency cover costs a premium on every shift. The people you have are covering for the people you cannot hire." },
  { title: "Care hours lost to internal transport", body: "Linen to floors, trays to rooms, supplies from stores, waste out. Every trip is time a carer is not with a resident." },
  { title: "Flat budgets against rising wage cost", body: "Headcount is not going up. The only lever left is what the team you already have spends its time on." },
];

const steps = [
  { n: "1", title: "Survey", body: "We walk your home, measure corridor widths, lift access and floor surfaces, and tell you honestly whether a robot will work." },
  { n: "2", title: "Specify", body: "We match the robot to the job, not the catalogue." },
  { n: "3", title: "Deploy", body: "Installation, route mapping, lift and door integration, staff training." },
  { n: "4", title: "Support", body: "UK-based engineers, response within 24 hours, software updates, spare parts." },
];

export default async function HomePage() {
  const [products, industries, resources] = await Promise.all([getProducts(), getIndustries(), getResources()]);
  const hero = resolveImage("/images/home/hero.jpg") ?? resolveImage("/images/home/hero.png");
  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* Hero — the one orchestrated motion moment */}
      <section className="bg-paper pt-14 pb-16 sm:pt-20 sm:pb-24" aria-labelledby="hero-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="hero-rise max-w-2xl">
              <p className="text-(length:--step--1) text-slate">Service robots for UK care homes, hotels, restaurants and retail</p>
              <h1 id="hero-heading" className="mt-4">Give your carers back the hours they spend walking.</h1>
              <p className="mt-6 text-(length:--step-1) text-slate">
                Carebot UK supplies, installs and maintains commercial service robots for care homes, hotels, restaurants and retail. UK-based engineers, a demonstration facility in Kent, and support measured in hours.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/demo">Book a demo</ButtonLink>
                <ButtonLink href="/products" variant="secondary">See the robots</ButtonLink>
              </div>
            </div>
            <ImageFrame
              src={hero}
              alt="A delivery robot working in a care home corridor, with a member of staff walking past"
              aspect="portrait"
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              label="Northfleet photography to follow"
            />
          </div>
        </Container>
      </section>

      <TrustStrip />

      <Section band="paper" ariaLabelledBy="problem-heading">
        <SectionHeading id="problem-heading" title="The problem is not a shortage of robots. It is a shortage of hours." />
        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="border-t border-stone pt-6">
              <h3>{p.title}</h3>
              <p className="mt-3 text-slate">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="how-heading">
        <SectionHeading id="how-heading" title="What we do" lede="Anyone can sell you a robot. The work is in what happens after it arrives." />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-[var(--radius)] bg-paper p-6">
              <span className="font-serif text-(length:--step-4) leading-none text-accent">{s.n}</span>
              <h3 className="mt-4">{s.title}</h3>
              <p className="mt-2 text-slate">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <SupportStrip />
        </div>
      </Section>

      <Section band="paper" ariaLabelledBy="robots-heading">
        <SectionHeading id="robots-heading" title="The robots" lede="Shown in the context of the job they do, not a spec catalogue. Filter by where you would use one." />
        <ProductGrid
          items={products.map((p, idx) => ({ slug: p.slug, industries: p.industries, card: <ProductCard product={p} priority={idx < 3} /> }))}
          industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
        />
      </Section>

      <DemoBlock />

      <Section band="paper" ariaLabelledBy="industries-heading">
        <SectionHeading id="industries-heading" title="Where they work" />
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
        </div>
      </Section>

      {resources.length ? (
        <Section band="mist" ariaLabelledBy="resources-heading">
          <SectionHeading id="resources-heading" title="Guides for operations directors" lede="Written for the person who has been asked to look into this and needs a straight answer." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((r) => <ResourceCard key={r.slug} resource={r} />)}
          </div>
        </Section>
      ) : null}

      <ClosingCta />
    </>
  );
}
