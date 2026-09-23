import Link from "next/link";
import { demoAddress, site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { VideoLoop } from "@/components/ui/VideoLoop";

/** The 24-hour UK response commitment. Appears on home, every product page and the footer. */
export function SupportStrip() {
  return (
    <div className="rounded-3xl border border-accent/15 bg-sage p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-(length:--step-2) font-semibold tracking-tight">When you need help, call your UK support team.</p>
        <p className="mt-2 max-w-2xl text-slate">
          Our UK-based robotics engineer handles installation and maintenance, with spare parts held locally. We respond within 24 hours for standard faults; hours of cover and emergency arrangements are confirmed at quotation.
        </p>
      </div>
      <div className="mt-5 shrink-0 sm:mt-0">
        <ButtonLink href="/services#support" variant="secondary">How support works</ButtonLink>
      </div>
    </div>
  );
}

export function TrustStrip() {
  return (
    <div className="border-y border-stone py-8">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-slate">UK distribution partner for</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-3">
          {site.manufacturers.map((m) => (
            <li key={m.slug} className="text-(length:--step-2) font-semibold tracking-tight">{m.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DemoBlock({ band = "green" }: { band?: "green" | "ink" | "mist" }) {
  const d = site.demoFacility;
  const inverse = band === "ink" || band === "green";
  return (
    <Section band={band} ariaLabelledBy="demo-heading">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-[var(--radius)] bg-ink aspect-video">
          <VideoLoop src="/video/demo.mp4" poster="/video/poster.jpg" title="A service robot delivering to a table" />
        </div>
        <div>
          <p className={`text-(length:--step--1) ${inverse ? "text-stone" : "text-slate"}`}>Demonstration facility, Kent</p>
          <h2 id="demo-heading" className="mt-3">See how the robot handles your kind of work.</h2>
          <p className={`mt-5 text-(length:--step-1) ${inverse ? "text-paper/85" : "text-slate"}`}>
            Try a robot at our {d.city} demonstration facility. Tell us about your meal service, linen runs or guest deliveries. We will show you the relevant model and explain what your premises and team would need.
          </p>
          <p className={`mt-4 ${inverse ? "text-paper/85" : "text-slate"}`}>Or we will come to you for a site survey.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/demo" variant={inverse ? "inverse" : "primary"}>Book a demo</ButtonLink>
            <ButtonLink href="/contact?enquiry=survey" variant={inverse ? "inverse" : "secondary"}>Request a site survey</ButtonLink>
          </div>
        </div>
      </div>
      <p className={`mt-10 text-(length:--step--1) ${inverse ? "text-stone" : "text-slate"}`}>
        {demoAddress()}. Nearest station {d.nearestStation}. <Link href="/demo" className="underline underline-offset-4">Directions and what to expect</Link>.
      </p>
    </Section>
  );
}

export function ClosingCta({ title = "Which task would you like help with?", body = "Tell us what your team carries, where it goes and how often. We will help you identify the relevant robot and explain the next steps. You do not need to have chosen a model." }: { title?: string; body?: string }) {
  return (
    <Section band="green" ariaLabelledBy="closing-heading">
      <div className="max-w-3xl">
        <h2 id="closing-heading">{title}</h2>
        <p className="mt-5 text-(length:--step-1) text-paper/85">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/demo" variant="inverse">Book a demo</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Talk to our team</ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function PurchaseOrLease() {
  const l = site.lease;
  return (
    <div className="rounded-3xl bg-sage p-6 sm:p-8">
      <h2 className="text-(length:--step-3)">Purchase or monthly lease</h2>
      <p className="mt-3 text-slate">
        Outright purchase, or a monthly lease that spreads the cost{l.supportIncluded ? " and includes support" : ""}. We will help you compare the options for your business.
      </p>
      {l.fromMonthly ? (
        <p className="mt-4 font-serif text-(length:--step-3)">
          From {l.fromMonthly} per month{l.minimumTermMonths ? `, ${l.minimumTermMonths}-month minimum` : ""}.
        </p>
      ) : (
        <p className="mt-4 text-(length:--step--1) text-slate">The cost depends on the robot, configuration and installation work. We confirm the equipment, support and lease terms in a written quotation.</p>
      )}
      <div className="mt-6">
        <ButtonLink href="/contact?enquiry=pricing" variant="secondary" size="sm">Ask about pricing</ButtonLink>
      </div>
    </div>
  );
}
