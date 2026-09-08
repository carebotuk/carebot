import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustriesForProduct, getProduct, getProducts, getRelatedProducts, monthYear } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { resolveImage } from "@/lib/images";
import { absoluteUrl, categoryLabels, manufacturerName, site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Chip } from "@/components/ui/Chip";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductCard } from "@/components/site/ProductCard";
import { IndustryCard } from "@/components/site/IndustryCard";
import { ClosingCta, PurchaseOrLease, SupportStrip } from "@/components/site/Blocks";
import { SpecTable } from "@/components/site/SpecTable";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.seo.title ?? `${p.name} UK | ${p.tagline}`,
    description: p.seo.description ?? p.shortDescription,
    path: `/products/${p.slug}`,
    ogImage: p.seo.ogImage ?? resolveImage(p.heroImage),
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const [industries, related] = await Promise.all([getIndustriesForProduct(product), getRelatedProducts(product)]);
  const hero = resolveImage(product.heroImage);
  const datasheet = resolveImage(product.datasheet);
  const verified = product.specsStatus === "verified";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: manufacturerName(product.manufacturer) },
    category: categoryLabels[product.category],
    url: absoluteUrl(`/products/${product.slug}`),
    ...(hero ? { image: absoluteUrl(hero) } : {}),
    offers: {
      "@type": "Offer",
      availability: product.status === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      priceCurrency: "GBP",
      ...(site.lease.fromMonthly ? { priceSpecification: { "@type": "PriceSpecification", price: site.lease.fromMonthly, priceCurrency: "GBP" } } : {}),
      seller: { "@id": absoluteUrl("/#organization") },
      areaServed: "GB",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Section band="paper" className="pb-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products" }, { name: product.name, href: `/products/${product.slug}` }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ImageFrame src={hero} alt={product.heroImageAlt ?? product.name} aspect="square" priority sizes="(min-width: 1024px) 50vw, 100vw" label="Product photography to follow" />
          <div>
            <p className="text-slate">{manufacturerName(product.manufacturer)}</p>
            <h1 className="mt-2">{product.name}</h1>
            <p className="mt-4 text-(length:--step-2) text-slate">{product.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>{categoryLabels[product.category]}</Chip>
              {product.status === "coming-soon" ? <Chip tone="accent">Coming soon</Chip> : null}
              <Chip>Buy or lease</Chip>
              <Chip>24-hour UK support</Chip>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/demo?product=${product.slug}`}>Book a demo</ButtonLink>
              {datasheet ? (
                <ButtonLink href={datasheet} variant="secondary" target="_blank" rel="noopener">Download datasheet</ButtonLink>
              ) : (
                <ButtonLink href={`/contact?enquiry=general&product=${product.slug}`} variant="secondary">Request datasheet</ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section band="paper" className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose" dangerouslySetInnerHTML={{ __html: product.html }} />
          <div className="space-y-6">
            <PurchaseOrLease />
            <div className="rounded-[var(--radius)] border border-stone p-6">
              <h2 className="text-(length:--step-1)">Support</h2>
              <p className="mt-2 text-slate">{site.supportCommitment} Spare parts held in the UK.</p>
              <Link href="/services#support" className="mt-3 inline-block font-medium text-accent underline-offset-4 hover:underline">How support works</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="benefits-heading">
        <h2 id="benefits-heading" className="mb-10">Why it works</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {product.keyBenefits.map((b) => (
            <div key={b.title} className="border-t border-stone pt-5">
              <h3>{b.title}</h3>
              <p className="mt-2 text-slate">{b.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {product.videoUrl || product.gallery.length ? (
        <Section band="paper" ariaLabelledBy="media-heading">
          <h2 id="media-heading" className="mb-8">In use</h2>
          {product.videoUrl ? (
            <div className="aspect-video overflow-hidden rounded-[var(--radius)] bg-mist">
              <iframe src={product.videoUrl} title={`${product.name} video`} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          ) : null}
          {product.gallery.length ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.map((g) => (
                <li key={g.src}><ImageFrame src={resolveImage(g.src)} alt={g.alt} /></li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      {industries.length ? (
        <Section band="paper" ariaLabelledBy="where-heading">
          <h2 id="where-heading" className="mb-8">Where it works</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((i) => <IndustryCard key={i.slug} industry={i} />)}
          </div>
        </Section>
      ) : null}

      {product.useCases.length ? (
        <Section band="mist" ariaLabelledBy="usecases-heading">
          <h2 id="usecases-heading" className="mb-10">Jobs it does</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {product.useCases.map((u) => (
              <div key={u.title} className="rounded-[var(--radius)] bg-paper p-6">
                <h3>{u.title}</h3>
                <p className="mt-2 text-slate">{u.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section band="paper" ariaLabelledBy="specs-heading">
        <h2 id="specs-heading" className="mb-3">Specifications</h2>
        {verified ? (
          <>
            <p className="mb-8 text-slate">
              Specifications verified {monthYear(product.specsVerifiedOn)}. Confirmed at point of quotation.
              {product.specsSource ? <> Figures as stated by {manufacturerName(product.manufacturer)}{product.datasheetVersion ? ` (datasheet ${product.datasheetVersion})` : ""}.</> : null}
            </p>
            <SpecTable specs={product.specs} manufacturer={manufacturerName(product.manufacturer)} />
          </>
        ) : (
          <div className="max-w-3xl rounded-[var(--radius)] border border-stone p-6">
            <p className="font-medium">Being verified against the official {manufacturerName(product.manufacturer)} datasheet.</p>
            <p className="mt-2 text-slate">
              We publish six to eight decision-relevant figures per robot, such as payload, runtime, minimum corridor width and lift capability, and only once they are confirmed by the manufacturer. Reseller figures for this model conflict, so we are not publishing them. Ask us and we will send what we can stand behind.
            </p>
            <div className="mt-5">
              <ButtonLink href={`/contact?enquiry=general&product=${product.slug}`} variant="secondary" size="sm">Ask for specifications</ButtonLink>
            </div>
          </div>
        )}
        {product.options.length ? (
          <div className="mt-10 max-w-3xl">
            <h3>Order-time options</h3>
            <dl className="mt-4 divide-y divide-stone border-y border-stone">
              {product.options.map((o) => (
                <div key={o.name} className="grid gap-1 py-3 sm:grid-cols-[1fr_1fr]">
                  <dt className="font-medium">{o.name}</dt>
                  <dd className="text-slate">{o.values.join(" / ")}{o.note ? <span className="block text-(length:--step--1)">{o.note}</span> : null}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </Section>

      {product.faqs.length ? (
        <Section band="mist"><Faq items={product.faqs} /></Section>
      ) : null}

      <Section band="paper">
        <SupportStrip />
      </Section>

      {related.length ? (
        <Section band="paper" className="pt-0 sm:pt-0" ariaLabelledBy="related-heading">
          <h2 id="related-heading" className="mb-8">Other robots</h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <li key={p.slug}><ProductCard product={p} /></li>)}
          </ul>
        </Section>
      ) : null}

      <ClosingCta title={`See ${product.name} working before you decide.`} />
    </>
  );
}
