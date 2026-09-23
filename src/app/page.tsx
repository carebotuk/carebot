import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { resolveImage } from "@/lib/images";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Arrow, ButtonLink, TextLink } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { VideoLoop } from "@/components/ui/VideoLoop";

export const metadata: Metadata = pageMetadata({
  title: "Service robots for hotels, restaurants, retail and care | Carebot UK",
  description: "Put service robots to work in your business. Delivery, table service and reception robots, with UK installation, staff training and ongoing support. Book a demo in Kent.",
  path: "/",
});

const sectors: Record<string, { task: string; description: string }> = {
  hotels: { task: "Guest deliveries", description: "Move amenities, linen and supplies between floors, with your team focused on the guest experience." },
  restaurants: { task: "Help with the plate runs", description: "Help carry dishes between the kitchen and dining room, leaving your team more time at the table." },
  hospitals: { task: "Linen and supply deliveries", description: "Explore routine deliveries between agreed handover points, with routes assessed around your hospital." },
  retail: { task: "Guidance and promotions", description: "Guide visitors and bring promotions onto the shop floor with a mobile reception and service robot." },
  "care-homes": { task: "Linen runs and mealtimes", description: "Support routine linen and supply rounds so staff can spend more time with residents." },
};
const sectorOrder = ["hotels", "restaurants", "retail", "care-homes", "hospitals"];

const steps = [
  { title: "Choose a useful task", body: "Tell us what staff carry, where it goes and how often. We help you identify a suitable robot and a practical starting point." },
  { title: "Check your premises", body: "We assess the routes, floor surfaces, doors, lifts and charging space, then set out the equipment and installation needed." },
  { title: "Install and train", body: "We set up the robot and its destinations, then show your staff how to send deliveries, receive them and handle interruptions." },
  { title: "Keep it working", body: "UK-based engineers, software updates and spare parts. Response within 24 hours for standard faults." },
];

export default async function HomePage() {
  const [products, industries] = await Promise.all([getProducts(), getIndustries()]);
  const orderedIndustries = [...industries].sort((a, b) => sectorOrder.indexOf(a.slug) - sectorOrder.indexOf(b.slug));
  const featured = products.find((p) => p.slug === "flashbot-max") ?? products[0];

  return (
    <>
      <section className="overflow-hidden bg-sage pt-12 pb-10 sm:pt-20 sm:pb-14" aria-labelledby="hero-heading">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
            <div className="hero-rise">
              <p className="flex items-center gap-3 text-sm font-medium text-accent"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />Service robots, installed and supported in the UK</p>
              <h1 id="hero-heading" className="mt-6 max-w-[12ch] text-[clamp(2.75rem,5.4vw,4.75rem)] leading-[1.03] tracking-[-0.045em]">Less carrying.<br /><span className="text-accent">More time for people.</span></h1>
              <p className="mt-6 max-w-lg text-lg text-slate">When your team is busy carrying dishes, fetching linen or delivering supplies, they have less time for guests, customers and residents. Our robots can help with those repeated journeys.</p>
              <p className="mt-4 max-w-lg text-slate">Carebot UK supplies Pudu service robots for restaurants, care homes, hospitals, hotels and retail. We help you choose the right model, install it at your premises and support your team as they use it.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/demo">See a robot in action</ButtonLink>
                <ButtonLink href="#robots" variant="secondary">Explore the robots</ButtonLink>
              </div>
              <p className="mt-5 text-sm text-slate">Try one at our demonstration facility in Northfleet, Kent.</p>
            </div>
            {featured ? (
              <div className="relative rounded-[2rem] bg-white p-5 sm:p-8">
                <div className="flex items-center justify-between gap-4 text-sm"><span className="rounded-full bg-mist px-3 py-1.5">Meet {featured.name}</span><span className="text-slate">Delivery robot</span></div>
                <ImageFrame src={resolveImage(featured.heroImage)} alt={featured.heroImageAlt ?? featured.name} aspect="square" priority sizes="(min-width: 1024px) 45vw, 100vw" className="mt-4 bg-white" />
                <Link href={`/products/${featured.slug}`} className="group mt-4 flex items-center justify-between gap-4 border-t border-stone pt-5 font-medium"><span>See what {featured.name} can deliver</span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white"><Arrow /></span></Link>
              </div>
            ) : null}
          </div>
          <div className="mt-12 grid gap-4 border-t border-accent/20 pt-6 text-sm font-medium text-accent sm:grid-cols-3">
            <p>Matched to your building and workflow</p><p>Installation and staff training</p><p>Ongoing support from UK engineers</p>
          </div>
        </Container>
      </section>

      <Section id="robots" band="mist" ariaLabelledBy="robots-heading" className="scroll-mt-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading id="robots-heading" kicker="Find the right fit" title="Meet the robots." lede="Enclosed deliveries around your building, or tray service on the floor? Start with the job, then explore the model that fits." />
          <div className="mb-10 shrink-0 sm:mb-14"><TextLink href="/products">View all robots</TextLink></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => {
            return (
              <article key={product.slug} className="flex flex-col overflow-hidden rounded-3xl bg-white">
                <div className="relative px-8 pt-8">
                  <p className="relative z-10 text-sm font-medium text-accent">{product.tagline}</p>
                  <ImageFrame src={resolveImage(product.heroImage)} alt={product.heroImageAlt ?? product.name} aspect="video" sizes="(min-width: 1024px) 45vw, 100vw" className="mt-3 bg-white" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="text-3xl">{product.name}</h3>
                  <p className="mt-4 text-slate">{product.shortDescription}</p>
                  <div className="mt-auto pt-8"><ButtonLink href={`/products/${product.slug}`} variant="secondary">Explore {product.name}</ButtonLink></div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-slate">Purchase and lease options available. Suitability, configuration and pricing confirmed after assessing your requirements.</p>
      </Section>

      <Section ariaLabelledBy="industries-heading">
        <SectionHeading id="industries-heading" kicker="Find your sector" title="What would you like help with?" lede="See which robots suit your setting, the jobs they can take on and what we check before installation." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {orderedIndustries.map((industry, index) => {
            const sector = sectors[industry.slug];
            return (
              <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group flex flex-col rounded-2xl border border-stone bg-paper p-6 transition-colors hover:border-accent hover:bg-sage">
                <div className="flex items-center justify-between text-sm text-accent"><span>{industry.shortName ?? industry.name}</span><span aria-hidden="true">0{index + 1}</span></div>
                <h3 className="mt-8">{sector?.task ?? industry.headline}</h3>
                <p className="mt-4 text-sm text-slate">{sector?.description ?? industry.intro}</p>
                <span className="mt-auto flex items-center gap-3 pt-8 text-sm font-medium">See robots for this sector <Arrow /></span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section ariaLabelledBy="deployment-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="text-sm font-medium text-accent">What Carebot UK does for you</p>
            <h2 id="deployment-heading" className="mt-4">From choosing a robot to using it every day.</h2>
            <p className="mt-5 text-lg text-slate">You get a UK partner for the whole installation. We assess the work and your premises, set up the robot, train your staff and provide ongoing engineering support.</p>
            <div className="mt-7"><TextLink href="/services">How deployment and support work</TextLink></div>
          </div>
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-stone pt-5">
                <span className="text-sm font-medium text-accent">0{index + 1}</span>
                <h3 className="mt-3">{step.title}</h3>
                <p className="mt-3 text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <section className="bg-accent py-16 text-white sm:py-24" aria-labelledby="demo-heading">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm text-white/75">See the robots before you decide</p>
              <h2 id="demo-heading" className="mt-4 text-4xl sm:text-5xl">Bring us a task.<br />Try the robot.</h2>
              <p className="mt-6 text-lg text-white/85">Could it carry your meal trays? Would it help with linen runs? Visit our Northfleet demonstration facility, try the controls and discuss the work you need done.</p>
              <p className="mt-4 text-white/85">A floor plan or a few photos can help, but you can start with a conversation. We will explain which model to consider and what we need to assess at your premises.</p>
              <div className="mt-8 flex flex-col gap-4 sm:items-start">
                <ButtonLink href="/demo" variant="inverse">Book your demo</ButtonLink>
                <Link href="/contact?enquiry=survey" className="text-sm underline underline-offset-4 hover:text-white/75">Prefer a visit to your premises? Request a site survey</Link>
              </div>
              <p className="mt-6 text-sm text-white/70">Northfleet, Kent · By appointment</p>
            </div>
            <div>
              <div className="aspect-video overflow-hidden rounded-2xl bg-ink"><VideoLoop src="/video/demo.mp4" poster="/video/poster.jpg" title="A service robot delivering to a table" /></div>
              <p className="mt-4 text-sm text-white/75">See service robotics in motion.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
