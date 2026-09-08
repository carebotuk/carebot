import type { MetadataRoute } from "next";
import { getIndustries, getProducts, getResources } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, industries, resources] = await Promise.all([getProducts(), getIndustries(), getResources()]);
  const now = new Date();
  const fixed = ["/", "/products", "/industries", "/services", "/demo", "/resources", "/about", "/contact", "/privacy", "/cookies", "/terms"];
  return [
    ...fixed.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : p === "/demo" ? 0.9 : 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...industries.map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...resources.map((r) => ({ url: absoluteUrl(`/resources/${r.slug}`), lastModified: new Date(r.publishedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
