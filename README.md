# Carebot UK website

Next.js 16 (App Router, TypeScript), Tailwind v4, markdown content in `/content` validated with Zod. Built from `carebot-uk-website-brief_1.md`. The previous single-page site is kept in `/oldsite` for reference and is not used by the build.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs check:content first, fails on invalid frontmatter
npm run lint
```

Copy `.env.example` to `.env.local` to enable GA4, Cal.com booking, Resend email, HubSpot and Slack. Without them the site builds and forms accept submissions, logging leads to the server console.

## Where things live

| Path | What |
|---|---|
| `content/` | Products, industries, services, resources, case studies, `site-settings.json`. See `content/README.md`. |
| `src/lib/content/schemas.ts` | Zod frontmatter schemas. Every spec and outcome needs a `source`. |
| `src/lib/content/index.ts` | Loaders and derived cross-links (product ↔ industry). |
| `src/lib/leads.ts` | HubSpot, Resend, Slack and consent records. |
| `src/lib/seo.ts` | Metadata helper and JSON-LD builders. |
| `src/app/globals.css` | Design tokens from Section 6 of the brief. |
| `scripts/check-content.ts` | Pre-build validation and spec staleness warnings. |
| `public/images/[type]/[slug]/` | Image convention (Keystatic-ready). |

## Content conventions

- Product specs stay `specsStatus: "indicative"` and are hidden until verified against the official datasheet, then set `"verified"` with `specsSource` and `specsVerifiedOn`.
- No image yet? Leave the path in place; a neutral placeholder renders until the file exists.
- Empty strings in `site-settings.json` (phone, company number, lease price) are hidden or shown as "confirmed at quotation".

## Deploy

Vercel, zero config. `npm run build` is the build command. Set the env vars from `.env.example` in the Vercel project.
