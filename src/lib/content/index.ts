import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { ZodType } from "zod";
import {
  caseStudySchema,
  industrySchema,
  productSchema,
  resourceSchema,
  serviceSchema,
  type CaseStudyFrontmatter,
  type IndustryFrontmatter,
  type ProductFrontmatter,
  type ResourceFrontmatter,
  type ServiceFrontmatter,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Entry<T> = T & { body: string; html: string; file: string };

function readDir(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .filter((f) => !f.startsWith("_"))
    .map((f) => path.join(full, f));
}

async function renderMarkdown(body: string): Promise<string> {
  const out = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(body);
  return String(out);
}

async function loadAll<T>(dir: string, schema: ZodType<T>): Promise<Entry<T>[]> {
  const files = readDir(dir);
  const entries: Entry<T>[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`Invalid frontmatter in ${path.relative(process.cwd(), file)}:\n${issues}`);
    }
    entries.push({
      ...parsed.data,
      body: content,
      html: await renderMarkdown(content),
      file: path.relative(process.cwd(), file),
    });
  }
  return entries;
}

const byOrder = <T extends { displayOrder: number; name: string }>(a: T, b: T) =>
  a.displayOrder - b.displayOrder || a.name.localeCompare(b.name);

// ---------------------------------------------------------------- products
export type Product = Entry<ProductFrontmatter>;

export async function getProducts(): Promise<Product[]> {
  const all = await loadAll("products", productSchema);
  return all.sort(byOrder);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

// -------------------------------------------------------------- industries
export type Industry = Entry<IndustryFrontmatter>;

export async function getIndustries(includeHidden = false): Promise<Industry[]> {
  const all = await loadAll("industries", industrySchema);
  return all.filter((i) => includeHidden || i.status === "live").sort(byOrder);
}

export async function getIndustry(slug: string): Promise<Industry | undefined> {
  return (await getIndustries(true)).find((i) => i.slug === slug);
}

/** Products that list this industry, or that the industry recommends. Derived, both directions. */
export async function getProductsForIndustry(industry: Industry): Promise<Product[]> {
  const products = await getProducts();
  const recommended = industry.recommendedProducts;
  return products
    .filter((p) => p.industries.includes(industry.slug) || recommended.includes(p.slug))
    .sort((a, b) => {
      const ai = recommended.indexOf(a.slug);
      const bi = recommended.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return byOrder(a, b);
    });
}

export async function getIndustriesForProduct(product: Product): Promise<Industry[]> {
  const industries = await getIndustries();
  return industries.filter(
    (i) => product.industries.includes(i.slug) || i.recommendedProducts.includes(product.slug),
  );
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({
      p,
      score:
        (p.category === product.category ? 2 : 0) +
        p.industries.filter((i) => product.industries.includes(i)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

// ------------------------------------------------------------ case studies
export type CaseStudy = Entry<CaseStudyFrontmatter>;

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const all = await loadAll("case-studies", caseStudySchema);
  return all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// --------------------------------------------------------------- resources
export type Resource = Entry<ResourceFrontmatter>;

export async function getResources(): Promise<Resource[]> {
  const all = await loadAll("resources", resourceSchema);
  return all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  return (await getResources()).find((r) => r.slug === slug);
}

// ---------------------------------------------------------------- services
export type Service = Entry<ServiceFrontmatter>;

export async function getServices(): Promise<Service[]> {
  const all = await loadAll("services", serviceSchema);
  return all.sort(byOrder);
}

// ---------------------------------------------------------------- helpers
export function monthYear(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function isStale(iso?: string, months = 6): boolean {
  if (!iso) return true;
  const d = new Date(iso + "T00:00:00Z");
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return d < cutoff;
}
