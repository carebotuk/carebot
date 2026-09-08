import { z } from "zod";

/**
 * Frontmatter schemas — Section 5 of the brief.
 * Kept flat and typed so Keystatic can map onto them later without rework.
 * `source` on specs and outcomes is mandatory: the build fails without it.
 */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

/** Treat "" as undefined so template files can keep every key present. */
const optStr = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().optional());
const optDate = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
);
const optUrl = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().url().optional());

const seo = z
  .object({
    title: optStr,
    description: optStr,
    ogImage: optStr,
  })
  .default({});

const faq = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const productCategory = z.enum(["delivery", "cleaning", "reception"]);
export const specGroup = z.enum([
  "Physical",
  "Performance",
  "Navigation",
  "Integration",
  "Software",
]);

export const productSchema = z.object({
  name: z.string().min(1),
  slug,
  manufacturer: z.string().min(1),
  category: productCategory,
  tagline: z.string().min(1),
  heroImage: optStr,
  heroImageAlt: optStr,
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  videoUrl: optUrl,
  shortDescription: z.string().min(1),
  keyBenefits: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().optional(),
      }),
    )
    .min(1),
  specs: z
    .array(
      z.object({
        group: specGroup,
        label: z.string().min(1),
        value: z.string().min(1),
        source: z.string().min(1, "every spec needs a source"),
      }),
    )
    .default([]),
  /** indicative = held in file but NOT rendered publicly; verified = rendered */
  specsStatus: z.enum(["indicative", "verified"]).default("indicative"),
  specsSource: optStr,
  specsVerifiedOn: optDate,
  datasheetVersion: optStr,
  options: z
    .array(
      z.object({
        name: z.string().min(1),
        values: z.array(z.string()).min(1),
        note: z.string().optional(),
      }),
    )
    .default([]),
  industries: z.array(slug).default([]),
  useCases: z
    .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
    .default([]),
  availability: z.enum(["purchase", "lease", "both"]).default("both"),
  datasheet: optStr,
  faqs: z.array(faq).default([]),
  seo,
  status: z.enum(["available", "coming-soon"]).default("available"),
  displayOrder: z.number().int().default(100),
});

export const industrySchema = z.object({
  name: z.string().min(1),
  slug,
  shortName: optStr,
  headline: z.string().min(1),
  intro: z.string().min(1),
  heroImage: optStr,
  heroImageAlt: optStr,
  recommendedProducts: z.array(slug).default([]),
  outcomes: z
    .array(
      z.object({
        metric: z.string().min(1),
        label: z.string().min(1),
        source: z.string().min(1, "every outcome needs a source"),
        sourceUrl: optUrl,
      }),
    )
    .default([]),
  relatedCaseStudies: z.array(slug).default([]),
  gatedResource: z.preprocess((v) => (v === "" ? undefined : v), slug.optional()),
  faqs: z.array(faq).default([]),
  seo,
  status: z.enum(["live", "hidden"]).default("live"),
  displayOrder: z.number().int().default(100),
});

export const caseStudySchema = z.object({
  title: z.string().min(1),
  slug,
  client: z.string().min(1),
  clientLogo: optStr,
  industry: slug,
  productsUsed: z.array(slug).default([]),
  metrics: z
    .array(z.object({ value: z.string(), label: z.string(), source: z.string().min(1) }))
    .default([]),
  pullQuote: z
    .object({ quote: z.string(), attribution: z.string(), role: z.string() })
    .optional(),
  isGated: z.boolean().default(false),
  gatedAsset: optStr,
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  seo,
});

export const resourceSchema = z.object({
  title: z.string().min(1),
  slug,
  resourceType: z.enum(["guide", "case-study", "checklist", "roi-model", "article"]),
  industry: slug.optional(),
  summary: z.string().min(1),
  coverImage: optStr,
  isGated: z.boolean().default(false),
  asset: optStr,
  formHeading: optStr,
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["live", "coming-soon"]).default("live"),
  seo,
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  slug,
  summary: z.string().min(1),
  displayOrder: z.number().int().default(100),
});

export type ProductFrontmatter = z.infer<typeof productSchema>;
export type IndustryFrontmatter = z.infer<typeof industrySchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudySchema>;
export type ResourceFrontmatter = z.infer<typeof resourceSchema>;
export type ServiceFrontmatter = z.infer<typeof serviceSchema>;
