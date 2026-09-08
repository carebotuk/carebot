# Carebot UK site

- Brief: `carebot-uk-website-brief_1.md` is the source of truth for content, structure and design tokens.
- Content is markdown in `content/`, validated by `src/lib/content/schemas.ts`. Run `npm run check:content` after editing content.
- Every number on the site needs a source. No invented percentages. Manufacturer claims are attributed to the manufacturer.
- Product specs stay hidden (`specsStatus: "indicative"`) until verified against an official datasheet.
- Tailwind v4: global element styles live inside `@layer base` in `globals.css` so utilities win. Use `text-(length:--step-N)` for the type scale.
- Sentence case everywhere. No all-caps eyebrow labels. Serif (Newsreader) only for pull quotes and stat callouts.
- `oldsite/` is the previous site, reference only.

@AGENTS.md
