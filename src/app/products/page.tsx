import type { Metadata } from "next";
import { getIndustries, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGrid } from "@/components/site/ProductGrid";
import { DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Service robots | Delivery, service and reception robots for UK businesses",
  description: "Compare FlashBot Max for enclosed deliveries and KettyBot Pro for tray service, reception and promotions. Supplied, installed and supported by Carebot UK.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, industries] = await Promise.all([getProducts(), getIndustries()]);
  return (
    <>
      <Section band="sage" className="pb-8 sm:pb-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="mb-4 text-sm font-medium text-accent">Find the right fit</p>
          <h1>Which robot would help your team?</h1>
          <p className="mt-5 text-(length:--step-1) text-slate">
            FlashBot Max carries enclosed deliveries around your building, including between floors where lift integration is possible. KettyBot Pro carries trays, guides visitors and displays greetings or offers. Explore the models below, or filter by your sector.
          </p>
        </div>
      </Section>
      <Section band="sage" className="pt-0 sm:pt-0">
        <ProductGrid
          items={products.map((p, idx) => ({ slug: p.slug, industries: p.industries, card: <ProductCard product={p} priority={idx < 3} /> }))}
          industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
        />
        <div className="mt-14">
          <SupportStrip />
        </div>
      </Section>
      <DemoBlock />
    </>
  );
}
