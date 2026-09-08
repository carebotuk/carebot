# Carebot UK — Website Build Brief

**Version:** 0.2
**Domain:** carebotuk.com
**Entity:** CAREBOT UK LTD, 17 Nottingham Street, Lower Ground, London W1U 5EW
**Purpose:** single source of truth handed to Claude Code. Content, structure, stack and design tokens are specified here so the build session spends its context on code.

**[CONFIRM]** = needs Abhi before build. **[LATER]** = deliberately out of scope for launch.

---

## 1. Business context

Carebot UK is a **distributor and solutions integrator** for commercial service robotics in the UK.

Two revenue lines:

1. **Distribution** — robots from manufacturers we hold UK distribution rights with: Pudu Robotics, LimX Dynamics, Reeman.
2. **Integration and service** — site survey, installation, route mapping, staff training, after-sales support, software updates, occasional custom work.

The second line is the differentiator and the site must not bury it. Anyone can list a robot. The buyer's real anxiety is *"what happens after it arrives, and who fixes it at 7am on a Tuesday."* We have a UK answer to that. Most competitors selling the same hardware do not.

**Lead sector: care homes.** Hospitality, restaurants and retail are supported but secondary. Warehousing is out at launch.

**Buyer:** care home group operations director, registered manager, or owner-operator. Not technical. Motivated by staff shortages, agency spend, and resident-facing time. Cautious, regulated, and reputationally exposed — which shapes every tone decision on this site.

---

## 2. What the site has to do

1. **Generate qualified enquiries** — a booked demo at Northfleet or a site survey is the conversion event that matters.
2. **Establish credibility** — we are new. Chinese-manufactured hardware in a UK care setting carries a trust question. The site must answer "who are you and why should I risk this."
3. **Rank organically** — medium-term play. See Section 8.
4. **Show products in the context of a job to be done**, not as a spec catalogue.

Primary CTA sitewide: **Book a demo**.
Secondary CTA: **Download the [industry] guide** (gated, Section 10).

---

## 3. Sitemap

```
/                                   Home
/products                           Product index (filterable)
/products/[slug]                    Product detail
/industries                         Industry index
/industries/[slug]                  Industry solution page
/services                           Implementation & support
/demo                               Book a demo / visit Northfleet
/resources                          Resource hub
/resources/[slug]                   Guide / case study detail (some gated)
/about                              About us
/contact                            Contact
/privacy  /cookies  /terms          Legal
/sitemap.xml  /robots.txt
```

Primary nav: Products · Industries · Services · Resources · About · **Book a demo** (button)

Products and Industries are dropdowns generated from content files, so new entries appear automatically.

Footer: full product list, industry list, services, company links, legal, registered address, company number **[CONFIRM]**, demo location, LinkedIn.

---

## 4. Technical stack

Revised from v0.1. **No CMS at launch.**

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Static generation, strong SEO defaults |
| Content | Markdown/MDX files in `/content` | Version-controlled, no vendor, no monthly cost, native to Claude Code |
| Validation | Zod schemas on frontmatter | Build fails loudly if a product file is missing a required field |
| Hosting | Vercel | Zero-config, preview deploys |
| Styling | Tailwind + CSS custom properties | Tokens from Section 6 |
| Forms | React Hook Form + Zod | |
| Email | Resend | Transactional asset delivery |
| CRM | HubSpot free tier | Don't build lead management |
| Booking | Cal.com or HubSpot Meetings | |
| Analytics | GA4 + Search Console, consent-mode v2 | |

**Why not hand-written HTML.** Adding a product would mean manually editing the nav, product index, sitemap, JSON-LD and cross-links on three industry pages. By the sixth product there is drift and broken links. Markdown files give the same "just edit a file" simplicity with none of the duplication.

**No database.** No auth, no application state. Leads go to HubSpot, content lives in the repo.

### Editing workflow — how content actually gets added

Three tiers, in increasing order of editor-friendliness. All three store content as the same markdown files, so moving between them costs nothing.

**Tier 1 — raw markdown (launch default)**
Duplicate an existing file in `/content`, change the frontmatter, commit. Via the GitHub web UI this needs no terminal or git client: Add file → paste → commit → Vercel rebuilds. About five minutes for someone who has done it once.

Two known friction points:
- *YAML is unforgiving.* An unquoted colon in a value (`tagline: Rides the lift: delivers to the door`) or a wrong indent fails the build, and the editor sees a red cross on Vercel rather than a useful error. Mitigate by quoting all string values in the template files and by keeping a documented example file per content type.
- *Images are the real problem.* They must land in the correct folder, be named to match the frontmatter path, and be sized and compressed appropriately. The GitHub web UI has no crop, resize or preview, and will accept a 6MB phone photo straight into the hero slot. Text-only case studies are fine this way; a product with a hero and a gallery is not.

**Tier 2 — Keystatic (recommended addition at Phase 4)**
Git-backed CMS served at `/admin` on our own domain. Editors get typed form fields, image upload with paths handled automatically, validation before commit, and preview. Writes plain markdown into the repo — no database, no vendor, no monthly cost. Currently the strongest git-based CMS for Next.js.

Roughly half a day to wire up, and **additive**: it reads the same content files, so there is no migration and no rework. Adopt it when a second, less technical editor appears.

Limitations, accepted knowingly: each editor needs a GitHub account (or Keystatic Cloud for auth); no content scheduling; no draft/approval workflow. Immaterial for a ~20-page marketing site with one or two editors.

Decap CMS is the older alternative and is deliberately not chosen — development slowed materially after Netlify handed it to the community in 2023 and the editing UI has not kept pace.

**Tier 3 — Sanity or equivalent hosted CMS [LATER, conditional]**
Only if one of these becomes true: a marketing hire publishing multiple times a week; a genuine need for drafts, approvals or scheduling; or editors who must never touch GitHub. Not the case today. The content model in Section 5 is shaped so this migration stays mechanical.

**Sequencing decision:** build Phases 1–3 on raw markdown, since the schema will still be shifting while product and industry pages take shape and fewer moving parts makes that faster. Add Keystatic at Phase 4 once the model has settled — or pull it forward to Phase 1 if Naji is adding content from week one.

Phase 4 deliberately lands Keystatic **before** the Phase 6 content load, so nobody bulk-enters products or industry pages through raw markdown. The real trigger for pulling it forward is not the phase number but the first time someone other than the developer needs to publish.

**Keep the door open from Phase 1** — two constraints that cost nothing now and save rework later:
- **Keep frontmatter flat and typed.** Avoid deeply nested structures; Keystatic maps cleanly to flat fields and arrays of simple objects, awkwardly to nested trees.
- **Keep image paths conventional** — `/public/images/[type]/[slug]/`. Keystatic's image field maps directly to a predictable directory and will need reconfiguring if paths are ad hoc.

---

## 5. Content model

Every product, industry, case study and resource is a markdown file with typed frontmatter. Nothing hardcoded in components.

```
/content
  /products/flashbot-max.md
  /industries/care-homes.md
  /case-studies/
  /resources/care-homes-guide.md
  /services/
  site-settings.json
```

### `product` frontmatter
```yaml
name: FlashBot Max
slug: flashbot-max
manufacturer: pudu-robotics
category: delivery          # delivery | cleaning | reception
tagline: Rides the lift. Delivers to the door.
heroImage: /images/products/flashbot-max/hero.jpg
gallery: []
videoUrl:
shortDescription:
keyBenefits:
  - title:
    description:
    icon:
specs:
  - group: Physical        # Physical | Performance | Navigation | Integration | Software
    label:
    value:
    source:                # attribution — mandatory, see Section 9
specsSource:               # URL of the manufacturer datasheet these came from
specsVerifiedOn:           # ISO date — drives the staleness check
datasheetVersion:          # manufacturer's own version/date, if stated
options:                   # order-time configurations, NOT separate products
  - name: Compartment configuration
    values: ["2", "3", "4"]
    note: Affects total payload
  - name: UV germicidal lamp
    values: ["Yes", "No"]
industries: [care-homes, hotels]
useCases:
  - title:
    description:
availability: both         # purchase | lease | both
datasheet: /files/...
faqs:
  - question:
    answer:
seo: {title, description, ogImage}
status: available          # available | coming-soon
displayOrder: 1
```

Body of the file = the overview prose.

#### Spec maintenance policy

Manufacturers revise hardware quietly and published figures drift. The response is to reduce the surface area we maintain and make staleness visible — **not** to strip specs and link out. Thin product pages don't rank, specs are what wins `[product] UK` and what gets pulled into AI-generated answers, and sending a warm buyer to the manufacturer's site routes them into a "find a distributor" flow that may hand the lead to a competitor.

**Publish 6–8 decision-relevant specs per product.** Payload, runtime, minimum corridor width, compartment or tray count, multi-floor capability, charge time, speed. These are what the buyer actually decides on and they are stable across minor revisions.

**Everything granular goes to the datasheet.** Sensor part numbers, voltages, IP ratings, materials. Mirror the manufacturer's own PDF on our domain with its version and date rather than deep-linking to their site — their URLs are already unreliable (`/products/flashbot-new` resolves to FlashBot Max, not FlashBot). Mirroring requires the media permissions listed in Section 9.

**Make staleness automatic, not remembered.**
- Render on every product page: *"Specifications verified [Month Year]. Confirmed at point of quotation."* This is honest, and it is the wording that protects against a misrepresentation claim if the hardware changes between publication and sale.
- Build script flags any product where `specsVerifiedOn` is more than six months old. Warning at first, not a build failure.
- Re-verify all products at each manufacturer catalogue update.

#### Variants vs options

**Test:** would a buyer search for it by name, and would they choose between the two?

- **Yes → separate product file, separate URL.** FlashBot and FlashBot Max qualify: different payload, different navigation, different use case. Separate pages also each rank for their own term.
- **No → an entry in `options`.** Compartment count, tray count, UV lamp. These are order-time checkboxes, not products.

Where an option changes a spec, express the spec as a range rather than duplicating the product: *"Payload up to 20 kg (10 kg per compartment, 2–4 compartments)."*

Settle this schema now. Changing frontmatter shape after ten products means hand-editing ten files. The spec content itself is a Phase 6 task.

### `industry` frontmatter
```yaml
name: Care Homes
slug: care-homes
heroImage:
recommendedProducts: [flashbot-max, kettybot-pro]
outcomes:
  - metric:
    label:
    source:                # mandatory, see Section 9
relatedCaseStudies: []
gatedResource: care-homes-guide
faqs: []
seo: {}
```

Body contains: problem statement, solution narrative, deployment considerations.

Product ↔ industry cross-linking is derived at build time from the `industries` array, so the relationship is stated once and rendered in both directions.

### `caseStudy` frontmatter
```yaml
title:
client:                    # may be anonymised: "A 60-bed care home in Kent"
clientLogo:                # requires written permission
industry: care-homes
productsUsed: [flashbot-max]
metrics:
  - value:
    label:
pullQuote: {quote, attribution, role}
isGated: true
gatedAsset: /files/...
publishedAt:
```

### `resource` frontmatter
```yaml
title:
resourceType: guide        # guide | case-study | checklist | roi-model
industry: care-homes
coverImage:
isGated: true
asset: /files/...
formHeading:
```

Summary always public and indexable. Gate is on the download, not the page.

---

## 6. Design direction

### Reference

The Hyperion automotive concept supplied is the visual reference. **Take from it:**

- **Generous white space** and long vertical rhythm. Sections breathe.
- **Near-monochrome palette** with light grey section bands alternating against white.
- **Black pill CTAs** with a circular arrow affordance.
- **Three-up product card grid** — image, name, short spec chips, full-width button inside the card.
- **Consistent rounded card corners**, soft and unfussy.
- **Dark footer** as a firm visual terminus with an oversized wordmark.
- **Restrained sans/serif pairing.**

**Don't take:**

- **The italic-serif second line** (*Dream Drive*, *Signature Series*, *Frequently Asked Questions*). It's a luxury-automotive and fashion trope. On a care robotics site it reads as aspirational styling applied to a functional purchase, and a care home operations director is not buying a dream. Keep the two-family pairing, but spend the serif on pull quotes and stat callouts rather than headline flourish.
- **Total monochrome.** In a car showroom, cold reads as premium. In care, cold reads as clinical and impersonal — the opposite of the reassurance this buyer needs. Warm the neutrals and allow one restrained accent.
- **Glamour photography.** Their hero sells desire; ours sells trust. The hero is a robot working in a plausible UK care environment, not a beauty shot.

### Tokens

```css
--ink:     #1C1B19;   /* warm near-black, display and body text */
--paper:   #FFFFFF;   /* primary ground */
--mist:    #F2F2F0;   /* alternating section bands */
--stone:   #DEDDD8;   /* borders, dividers, card outlines */
--slate:   #6B6A66;   /* secondary text, spec labels */
--accent:  #2F5D50;   /* deep muted green — links, active states, small signals */
--alert:   #B4552A;   /* sparing, alerts only */
```

The near-black carries a warm cast deliberately; a cool or blue-black pushes the whole page clinical. Primary CTAs are `--ink` pills as in the reference. `--accent` is used sparingly — links, active nav, icon fills — never as a background wash.

### Typography

Two families, clearly distinct.

- **Sans (display + UI):** neutral grotesque, good tight tracking at large sizes. **[SUGGESTION: Söhne if budget allows; Geist or Inter Tight otherwise.]**
- **Serif (pull quotes, stat callouts, testimonials only):** transitional serif with visible contrast. **[SUGGESTION: Newsreader, or Editorial New if budget allows.]**

Rules:
- Sentence case throughout. No tracked-out all-caps eyebrow labels.
- Body copy under 75 characters per line.
- Type scale per *Elements of Typographic Style*, set once as tokens.
- Product specs in real tables, not cards. Operations buyers scan; don't make them hunt.

### Layout and motion

- Left-aligned. Max content width ~1200px.
- Alternating `--paper` and `--mist` section bands, as in the reference.
- One orchestrated motion moment: the hero. No fade-up on every section, no hover-lift on every card.
- **Accessibility is non-negotiable** given the care audience: WCAG 2.2 AA, visible keyboard focus, `prefers-reduced-motion` respected, real alt text, captions on video.

### Imagery

Real UK photography and video is planned — it is the single highest-value asset on this site. Until it lands, use manufacturer product-on-neutral shots only. **Do not use manufacturer environment photography**; it reads as a Chinese hotel lobby to a UK buyer and undermines the exact credibility the page is building.

Shot list for the Northfleet session:
- Robot in a corridor with a person passing (shows yielding behaviour)
- Robot at a lift door
- Close detail: compartment opening, control screen
- An engineer working on a robot — this image does more for trust than any product shot
- Wide of the demo space
- 30–60s hero video loop, poster-frame first

---

## 7. Page-by-page content

### 7.1 Home

**Hero** — video or still of a robot working, in a plausible UK care setting.

> ### Give your carers back the hours they spend walking.
>
> Carebot UK supplies, installs and maintains commercial service robots for care homes, hotels, restaurants and retail. UK-based engineers, a demonstration facility in Kent, and support measured in hours.
>
> [Book a demo] [See the robots]

**Trust strip** — manufacturer logos, framed honestly:
*"UK distribution partner for Pudu Robotics, LimX Dynamics and Reeman."*

**The problem** — three columns, plain language. Staff shortages and agency spend. Care hours lost to internal transport. Flat headcount budgets against rising wage cost.

**What we do — four steps** (genuinely sequential, so numbering is appropriate)
1. **Survey** — we walk your home, measure corridor widths, lift access and floor surfaces, and tell you honestly whether a robot will work.
2. **Specify** — we match the robot to the job, not the catalogue.
3. **Deploy** — installation, route mapping, lift and door integration, staff training.
4. **Support** — UK-based engineers, response within 24 hours, software updates, spare parts.

**Robots** — three-up card grid, filterable by industry.

**Demo block** — prominent. See 7.5.

**Industries** — cards linking through.

**Resources** — three most recent guides.

**Closing CTA** — inline demo booking.

---

### 7.2 Product page template

```
Hero: image + name + tagline + [Book a demo] [Download datasheet]
Overview prose
Key benefits (3–5)
Video / gallery
Purchase or lease
Where it works (industry cards)
Use cases
Full specifications (grouped, collapsible on mobile)
FAQs
Related products
CTA
```

**Purchase or lease block** — confirmed as both, so this appears on every product page. It materially improves conversion by removing the capex objection:

> **Buy it or lease it.** Outright purchase, or a monthly lease that spreads the cost and includes support. Most care operators start with a lease on one unit.

**[CONFIRM: lease terms, minimum period, whether support is bundled, indicative monthly figure. A published range converts far better than "contact us" — even "from £X per month" is worth having.]**

#### Exemplar: FlashBot Max

**Tagline:** Rides the lift. Delivers to the door.

**Overview**
FlashBot Max moves items between floors without anyone carrying them. It calls the lift itself, navigates corridors around people, and releases its load only to the right person via PIN, phone number or NFC tap. In a care home it moves linen, supplies and consumables between floors and stores. The point is not novelty — it is the several hours a day your team currently spends walking instead of caring.

**Key benefits**
- **Genuinely multi-floor.** Cloud or hardware lift integration, so in most buildings no lift modification is required.
- **Secure handover.** Compartments unlock by PIN, phone number or NFC. Nothing is left in a corridor.
- **Full shift, unattended.** Returns to dock and charges itself.
- **Handles real buildings.** VSLAM+ with LiDAR copes with variable lighting, thresholds and covered outdoor walkways.

**Specifications — [BLOCKED PENDING OFFICIAL PUDU SPEC SHEET]**

Third-party reseller figures conflict, and the standard FlashBot differs materially from FlashBot Max. Indicative only; do not publish unverified.

| Group | Label | Indicative value |
|---|---|---|
| Physical | Dimensions | ~538 × 534 × 1050 mm |
| Physical | Weight | ~50 kg |
| Physical | Compartments | 2–4, adjustable |
| Performance | Payload | Up to 20 kg (10 kg per compartment) |
| Performance | Speed | 0.5–1.2 m/s |
| Performance | Runtime | Up to 9 hours |
| Performance | Charge time | ~4 hours |
| Navigation | System | VSLAM+ with 3D LiDAR SLAM |
| Navigation | Min. corridor width | ~70 cm |
| Integration | Lift | Cloud or hardware, major brands |
| Software | Fleet management | Pudu Link |

**Outstanding:** the URL supplied (`/products/flashbot-new`) resolves to FlashBot **Max**. The standard FlashBot is a separate indoor-only model with a higher 30 kg payload. Confirm which we distribute, or list both as separate products.

#### KettyBot Pro

**Tagline:** Serves, greets and promotes — on one chassis.

Secondary product for care homes (dining service, activities, reception); primary for hospitality and retail, where the 18.5" screen carries a second ROI argument.

**[CONFIRM]** — reseller specs conflict badly: payload listed at both 30 kg and 38 kg, trays at 2 and 3, minimum aisle at 52 cm and 55 cm. Official figures needed.

#### TRON 1 — omitted at launch, per decision. **[LATER]**

---

### 7.3 Industry pages

Highest-value pages on the site for both SEO and conversion.

```
Hero + [Book a site survey]
The problem (operational, specific, in their language)
How robotics helps (narrative, not features)
Outcomes (sourced metrics only)
Recommended robots
What deployment looks like in this setting   ← the objection handler
Case studies, or pre-launch the gated guide
FAQs
CTA
```

#### Care Homes — the flagship page

**Headline:** Give your carers back the hours they spend walking.

**The problem**
In a typical 60-bed home, care staff spend a meaningful part of every shift moving things rather than caring — linen to floors, meal trays, supplies from stores, waste out. Every trip is time not spent with a resident, in a sector running persistent vacancy rates and paying agency premiums to cover the gaps.

**How robotics helps**
Not by replacing carers. By removing internal transport that doesn't require a human being. A delivery robot running linen and supplies between floors frees a carer for resident-facing time — the thing you're inspected on, and the thing your staff came into the job to do.

**Deployment considerations in care settings** *(essential — this is what makes a cautious operations director trust us)*
- **Residents with dementia or mobility aids.** Route planning avoids high-risk areas, speed is capped, the robot yields. We survey for this specifically.
- **Infection control.** Enclosed compartments, wipe-down surfaces. **[CONFIRM whether we offer UV-equipped variants]**
- **CQC and inspection.** Internal logistics is not a regulated activity, but you'll want the change reflected in your policies and evidenced as increased resident-facing time. **[CONFIRM — this wording must be reviewed by someone who knows CQC before publishing. Do not overstate.]**
- **Staff acceptance.** The deployment fails if staff think it's there to replace them. Our training addresses this directly.
- **Night operation.** Quiet-mode routing and reduced speed overnight.

Conservative and defensible throughout. **No "reduces staff costs by X%" without a real deployment behind it.**

#### Hotels
Guest experience and night cover. FlashBot Max delivers amenities without the night porter leaving the desk. Strong out-of-hours staffing ROI.

#### Restaurants & hospitality
Table running and turnover. KettyBot Pro. The screen doubles as promotion. Globally the most-deployed use case, so "this is proven" is strongest here.

#### Retail
Greeting, in-store promotion, stock movement. Lead with advertising-screen ROI.

#### Warehousing — **omitted at launch**
Cut from nav until products are agreed. Add the page when the product exists; a thin page hurts more than a missing one.

---

### 7.4 Services

1. **Site survey and feasibility** — we tell you if it won't work.
2. **Specification and procurement**
3. **Installation and commissioning**
4. **Route mapping and environment configuration** — lift integration, door integration, no-go zones, dock placement.
5. **Staff training and change management**
6. **After-sales support** — **UK-based engineers. Response within 24 hours for standard faults; emergency response prioritised. [CONFIRM: what counts as an emergency, hours of cover, spare parts holding.]**
7. **Software updates and fleet management**
8. **Purchase and lease options**
9. **Custom integration** — selective, not a catch-all.

The 24-hour UK response commitment should appear on the homepage, every product page and the footer. It is our single strongest differentiator against a remote reseller and it should be impossible to miss.

---

### 7.5 Demo — `/demo`

The Northfleet facility is a genuine asset. LEC's Chelsea showroom is their strongest card; this is ours, and it deserves its own page rather than a line on Contact.

**Content:**
- Two robots on site, working, that you can operate yourself
- Address: Memorial Hall, Hall Road, Northfleet, Kent DA11 8AJ
- Embedded map, parking and rail guidance (Northfleet station)
- Booking calendar
- "What to expect" — 45 minutes, bring your corridor measurements, we'll run the robot through a scenario like yours
- Offer: we'll also come to you for a site survey

**[CONFIRM]** — is Memorial Hall a permanent facility or booked space? "Visit our showroom" implies permanence. If it's hired by arrangement, word it as "demonstration facility, by appointment" — still strong, and accurate. Getting this wrong is a small lie a visitor discovers on arrival.

---

### 7.6 About us

**Do not copy LEC's structure.** Their copy claims their solutions "power global giants like McDonald's, Marriott, Hilton" and cites Red Dot and iF Design awards. Those are almost certainly the *manufacturers'* customers and the *manufacturers'* product-design awards. Presented as the distributor's own, they are misleading. Replicating that would be:

- an ASA CAP Code exposure, which bites harder in a care context;
- fatal on reference-check, which care group procurement does routinely;
- unnecessary, because the honest version is nearly as strong.

**Honest version — use this:**

> Carebot UK is the UK distribution partner for Pudu Robotics, LimX Dynamics and Reeman. Pudu's service robots are deployed in hotels, restaurants and healthcare facilities across more than 60 countries **[CONFIRM figure with Pudu]**, and their product design has been recognised with Red Dot and iF Design awards **[CONFIRM, and attribute to Pudu explicitly]**.
>
> What the manufacturers can't offer from overseas is someone who will come to your home, measure your corridors, and answer the phone when something goes wrong. That's us. UK-based engineers, a demonstration facility in Kent you can visit this week, and support measured in hours.

Every credibility claim is attributed to whoever actually earned it. That attribution is the entire difference between borrowing credibility and faking it.

**Also needed:**
- Founding story — why this business, why now. **[Founders]**
- **Team — described by role, not by name, at launch.** Names and photographs deferred; revisit once the LinkedIn company page is established.

  The team is three founders plus a full-time UK team: a robotics engineer, a sales lead with deep UK care home experience, and an operations manager. Roles carry more weight with this buyer than founder CVs do, so lead with them.

  Two roles do specific work on the page:
  - **The robotics engineer is the proof behind the 24-hour SLA.** Every competitor claims UK support; most mean a number that routes to a reseller. "We employ a full-time robotics engineer" is a capability claim, not a personnel disclosure, and it is the most persuasive single line available.
  - **The sales lead's care background answers "do you understand my world."** State the years of care sector selling experience. **[CONFIRM figure]**

  **Draft copy:**

  > **A team, not a catalogue.**
  >
  > Carebot UK is owner-operated by three founders, with a full-time UK team: a robotics engineer who installs and maintains every machine we sell, a sales lead with [X] years selling into UK care homes, and an operations manager who runs deployments end to end.
  >
  > Between the founders we've spent over twenty years building and operating businesses in FMCG, technology and education — at Procter & Gamble, Cadbury and Pearson among others. **[CONFIRM sectors and employers are true across the founding team]** We're new to care robotics. We're not new to running operations, or to being the people who answer the phone.

  Two rules:
  - **Three sectors, not seven.** A long sector list for a small team reads as padding.
  - **Do not claim care sector operating experience unless it is real.** Selling experience in care is real and should be stated plainly; operating a care home is a different claim. It will be tested in the first meeting.

- **Compensating for no names or faces.** With the highest-trust element deferred, the rest of the page must carry more. Give proportionally more space to: the Northfleet facility, the manufacturer relationships, the in-house engineer, and the "what we don't do" paragraph. This page should be longer than a typical About, not shorter.
- Company details: CAREBOT UK LTD, 17 Nottingham Street, Lower Ground, London W1U 5EW. **[CONFIRM company number]**
- **What we don't do** — a short honest paragraph. Separates us from every competitor claiming everything, and does real trust work on a page without faces.

**[RELATED]** A LinkedIn company page with employees attached does much of the job names would, and is often the first thing procurement checks. Worth establishing before launch so the footer link points somewhere credible.

---

### 7.7 Contact

- Demo booking (primary) → routes to `/demo`
- General enquiry form: name, work email, company, role, industry, robot of interest, message, unticked consent checkbox
- Registered address, demo address, phone, response commitment

**[CONFIRM]** — a phone number is needed. A robotics supplier with only a web form does not clear a procurement check.

---

## 8. SEO

### Realistic assessment

We will not outrank `pudurobotics.com` on product names, or the large multi-country resellers on generic terms. That ground is taken.

Winnable ground is **UK + sector + job to be done**:

- `delivery robots for care homes UK`
- `care home automation UK`
- `service robots for hotels UK`
- `robot installation and support UK`
- `service robot lease UK`
- `how much does a service robot cost UK`
- `robot demo Kent` / `see a service robot UK` — low volume, very high intent, and winnable because we have somewhere to send people

### Brand name — act on this before spending

"Carebot" is a generic descriptor for care robots and there are existing uses of the term. Branded search will be noisy and hard to own.

**The trademark check is outstanding and should close before any spend on signage, vehicle livery, print or brand SEO.** A UK IPO search plus a look at who currently ranks for "carebot" is an afternoon's work, and much cheaper now than after the brand is in market. This is a live risk, not a formality.

### Structure

- **Industry pages are the primary organic assets.** 1,500+ words, genuinely useful, maintained.
- **Product pages** target `[product] UK` — low volume, very high intent.
- **Comparison and cost pages** are the long-tail engine: `FlashBot vs KettyBot`, `service robot cost UK`, `robot lease vs buy`. Cheap to produce, disproportionately effective.
- **Blog under `/resources`** — one substantial post monthly beats four thin ones.

### Technical

- Static generation for all content; rebuild on push.
- Per-page metadata from frontmatter, sensible fallbacks.
- `next/image`, AVIF/WebP.
- Core Web Vitals as a build gate: LCP < 2.5s, CLS < 0.1. Hero video poster-first and lazy-loaded.
- Auto-generated sitemap, canonical URLs, no duplicate paths.

### Structured data (JSON-LD)

| Page | Schema |
|---|---|
| Sitewide | `Organization` — UK address, logo, sameAs |
| Home | `WebSite` + `SearchAction` |
| Product | `Product` + `Offer` / `priceRange` |
| Industry | `Service` + `FAQPage` |
| Demo | `LocalBusiness` with the Northfleet address — supports local intent |
| Case study | `Article` |
| Inner pages | `BreadcrumbList` |

---

## 9. Claims and compliance

**Standing rule: every number has a source.** No invented percentages. No "up to 40% efficiency gains" without a real study or a real deployment of ours. The `source` field on specs and outcomes is mandatory in the schema, and the build should fail without it.

Manufacturer figures are attributed: *"Pudu states runtime of up to nine hours"*, not *"nine hours of runtime."*

Before launch:
- Written permission from Pudu, LimX and Reeman for imagery, video and trademark use. Distribution agreements usually grant this — **[CONFIRM it's explicit]**.
- UKCA/CE conformity documentation for every listed product. Regulated buyers will ask.
- Product and public liability insurance in place before anyone is invited to Northfleet. **[CONFIRM]**
- ICO registration for the company as data controller. **[CONFIRM — outstanding]**

---

## 10. Lead capture and gated content

We have no case studies yet. Publishing a "case study" that is really a generic overview is the fastest way to lose the trust the site exists to build.

Gate the same way, but be honest about the asset. Per industry, produce:

- **"Robotics in UK Care Homes: An Operations Director's Guide"** — sector context, what the technology can and can't do, a deployment checklist, questions to ask any supplier, and an honest section on what goes wrong.
- **ROI model** — staff hours on internal transport, hourly cost, purchase or monthly lease, payback period. Highest-converting asset for this buyer. Start as a spreadsheet; interactive later. **[LATER]**
- **Deployment readiness checklist** — corridor widths, lift specs, floor surfaces, wifi, charging locations.

Swap in real case studies as they land, same gate, same URL structure.

### Mechanics
1. Public indexable summary page. Gate on the download only.
2. Form: first name, last name, work email, company, role, industry, phone (optional).
3. **Email the asset as a link, not an instant download.** Verifies the address, kills junk leads, opens a follow-up thread.
4. Push to HubSpot free CRM. Don't build lead management.
5. Notify by email and/or Slack on submission.

### UK GDPR
- Consent for marketing; legitimate interest for asset delivery. Keep them separate.
- **Unticked** consent checkbox. Pre-ticked is unlawful.
- Record consent: timestamp, IP, form version, exact wording shown.
- Privacy notice linked from every form.
- Cookie banner with genuine reject-all; analytics blocked until consent.
- Named controller and contact route.

---

## 11. Build phases

**Phase 1 — Foundation.** Repo, Next.js + TS + Tailwind, design tokens, content directory structure, Zod frontmatter schemas, Vercel deploy, layout, nav, footer.

**Phase 2 — Core pages.** Home, About, Services, Demo, Contact. Real copy.

**Phase 3 — Dynamic content.** Product index and detail, industry index and detail, filtering, derived cross-linking.

**Phase 4 — Conversion.** Forms, validation, gated flow, Resend delivery, HubSpot integration, booking, GDPR consent, cookie banner.

**Phase 5 — SEO and polish.** Metadata, JSON-LD, sitemap, image optimisation, Core Web Vitals, accessibility audit, analytics.

**Phase 6 — Content load.** Product data verified against official spec sheets. Industry pages written. First gated guide produced. Northfleet photography shot and loaded.

**[LATER]** Warehousing sector, TRON 1 / research segment, interactive ROI calculator, multi-language, customer portal, live fleet status.

---

## 12. Open items

**Blocking launch**
1. Official spec sheets from Pudu — nothing publishes unverified
2. Company number, ICO registration, insurance confirmation
3. Phone number
4. Lease terms and indicative monthly pricing
5. Northfleet: permanent facility, or by appointment?
6. Written media permissions from all three manufacturers

**Blocking brand spend**
7. Trademark search on "Carebot"

**Content dependencies**
8. Founding story and team photos — Abhi and Naji
9. Northfleet photography and hero video
10. CQC wording reviewed by someone with sector expertise
11. UV-equipped model availability
12. Emergency-response definition for the SLA
