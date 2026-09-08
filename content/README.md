# Content

Everything on the site that is a product, industry, service, resource or case study lives here as a markdown file with typed frontmatter. The build validates every file against a Zod schema in `src/lib/content/schemas.ts` and fails with a readable error if a required field is missing.

## Adding a product

1. Duplicate `products/flashbot-max.md` and rename it to the new slug.
2. Change the frontmatter. Quote every string value. An unquoted colon breaks YAML.
3. Put the hero image at `public/images/products/<slug>/hero.png` (or .jpg / .webp) and set `heroImage` to `/images/products/<slug>/hero.png`.
4. Commit. The nav dropdown, product index, industry cross-links, sitemap and JSON-LD all update automatically.

Specs: set `specsStatus: "verified"`, `specsSource` and `specsVerifiedOn` once you have the official manufacturer datasheet. Until then the table is held in the file but not rendered. Every spec row needs a `source`. The build warns when `specsVerifiedOn` is more than six months old.

## Adding an industry

Duplicate `industries/hotels.md`. The body has three sections: the problem, how robotics helps, what deployment looks like. Products link to industries via their `industries` array; the industry can also pin an order with `recommendedProducts`. Both directions render automatically.

## Resources and case studies

Resources are public summary pages with a gated download. Set `isGated: true` and `asset` to a path under `public/files/`. Leave `asset` empty and `status: "coming-soon"` while the PDF is being written; the form still captures interest.

Case studies: files starting with `_` are ignored. Every metric needs a source.

## Site settings

`site-settings.json` holds the company details, addresses, phone, manufacturers and lease copy. Empty strings render as "to be confirmed" placeholders or are hidden.
