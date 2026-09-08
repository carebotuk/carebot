/**
 * Runs before `next build`. Validates every content file against its schema
 * (fails loudly) and warns about products whose specs were verified more than
 * six months ago (warning only, per the brief).
 */
import {
  getCaseStudies,
  getIndustries,
  getProducts,
  getResources,
  getServices,
  isStale,
} from "../src/lib/content";

async function main() {
  const [products, industries, caseStudies, resources, services] = await Promise.all([
    getProducts(),
    getIndustries(true),
    getCaseStudies(),
    getResources(),
    getServices(),
  ]);

  const industrySlugs = new Set(industries.map((i) => i.slug));
  const productSlugs = new Set(products.map((p) => p.slug));
  const resourceSlugs = new Set(resources.map((r) => r.slug));
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const p of products) {
    for (const i of p.industries) {
      if (!industrySlugs.has(i)) errors.push(`${p.file}: unknown industry "${i}"`);
    }
    if (p.specsStatus === "verified" && !p.specsVerifiedOn) {
      errors.push(`${p.file}: specsStatus is "verified" but specsVerifiedOn is missing`);
    }
    if (p.specsStatus === "verified" && !p.specsSource) {
      errors.push(`${p.file}: specsStatus is "verified" but specsSource is missing`);
    }
    if (p.specsStatus === "indicative") {
      warnings.push(`${p.file}: specs are indicative — table is hidden until verified`);
    } else if (isStale(p.specsVerifiedOn)) {
      warnings.push(`${p.file}: specs verified on ${p.specsVerifiedOn} — more than 6 months ago, re-verify`);
    }
  }
  for (const i of industries) {
    for (const s of i.recommendedProducts) {
      if (!productSlugs.has(s)) errors.push(`${i.file}: unknown recommended product "${s}"`);
    }
    if (i.gatedResource && !resourceSlugs.has(i.gatedResource)) {
      errors.push(`${i.file}: unknown gatedResource "${i.gatedResource}"`);
    }
  }
  for (const c of caseStudies) {
    if (!industrySlugs.has(c.industry)) errors.push(`${c.file}: unknown industry "${c.industry}"`);
  }
  for (const r of resources) {
    if (r.industry && !industrySlugs.has(r.industry)) errors.push(`${r.file}: unknown industry "${r.industry}"`);
    if (r.isGated && !r.asset) warnings.push(`${r.file}: gated but no asset path set — form will say "coming soon"`);
  }

  console.log(
    `content: ${products.length} products, ${industries.length} industries, ${services.length} services, ${resources.length} resources, ${caseStudies.length} case studies`,
  );
  for (const w of warnings) console.warn(`warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
