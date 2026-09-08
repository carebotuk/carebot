import type { Metadata } from "next";
import { getIndustries, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGrid } from "@/components/site/ProductGrid";
import { ClosingCta, DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Service robots | Delivery, service and reception robots for UK businesses",
  description: "Commercial service robots from Pudu Robotics, LimX Dynamics and Reeman, supplied, installed and supported in the UK by Carebot UK. Filter by care homes, hotels, restaurants and retail.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, industries] = await Promise.all([getProducts(), getIndustries()]);
  return (
    <>
      <Section band="paper" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products" }]} />
        <div className="mt-8 max-w-3xl">
          <h1>The robots</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            Every robot we list, we install, map, train your staff on and support from the UK. Specifications are verified against the official manufacturer datasheet before they are published, and confirmed at quotation.
          </p>
        </div>
      </Section>
      <Section band="paper" className="pt-0 sm:pt-0">
        <ProductGrid
          items={products.map((p, idx) => ({ slug: p.slug, industries: p.industries, card: <ProductCard product={p} priority={idx < 3} /> }))}
          industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
        />
        <div className="mt-14">
          <SupportStrip />
        </div>
      </Section>
      <DemoBlock />
      <ClosingCta />
    </>
  );
}
