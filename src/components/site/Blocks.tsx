import Link from "next/link";
import { demoAddress, site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { VideoLoop } from "@/components/ui/VideoLoop";

/** The 24-hour UK response commitment. Appears on home, every product page and the footer. */
export function SupportStrip() {
  return (
    <div className="rounded-[var(--radius)] border border-stone bg-paper p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-(length:--step-2) font-semibold tracking-tight">Response within 24 hours. From an engineer in the UK.</p>
        <p className="mt-2 max-w-2xl text-slate">
          We employ a full-time robotics engineer who installs and maintains every machine we sell, and we hold spare parts here. Standard faults are answered within 24 hours. That is the difference between a UK partner and an overseas reseller.
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

export function DemoBlock({ band = "ink" }: { band?: "ink" | "mist" }) {
  const d = site.demoFacility;
  const inverse = band === "ink";
  return (
    <Section band={band} ariaLabelledBy="demo-heading">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-[var(--radius)] bg-ink aspect-video">
          <VideoLoop src="/video/demo.mp4" poster="/_next/image?url=%2Fvideo%2Fposter.jpg&w=1200&q=75" title="A service robot delivering to a table" />
        </div>
        <div>
          <p className={`text-(length:--step--1) ${inverse ? "text-stone" : "text-slate"}`}>Demonstration facility, Kent</p>
          <h2 id="demo-heading" className="mt-3">See a robot working before you decide.</h2>
          <p className={`mt-5 text-(length:--step-1) ${inverse ? "text-paper/85" : "text-slate"}`}>
            Two robots on site at {d.line1}, {d.city}, that you can operate yourself. Forty-five minutes, {d.byAppointment ? "by appointment" : "open weekdays"}. Bring your corridor measurements and we will run the robot through a scenario like yours.
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

export function ClosingCta({ title = "Talk to someone who will come and measure your corridors.", body = "A booked demo at Northfleet or a site survey at your home is the best next step. No obligation, and we will tell you if it will not work." }: { title?: string; body?: string }) {
  return (
    <Section band="mist" ariaLabelledBy="closing-heading">
      <div className="max-w-3xl">
        <h2 id="closing-heading">{title}</h2>
        <p className="mt-5 text-(length:--step-1) text-slate">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/demo">Book a demo</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">General enquiry</ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function PurchaseOrLease() {
  const l = site.lease;
  return (
    <div className="rounded-[var(--radius)] bg-mist p-6 sm:p-8">
      <h2 className="text-(length:--step-3)">Buy it or lease it.</h2>
      <p className="mt-3 text-slate">
        Outright purchase, or a monthly lease that spreads the cost{l.supportIncluded ? " and includes support" : ""}. Most care operators start with a lease on one unit.
      </p>
      {l.fromMonthly ? (
        <p className="mt-4 font-serif text-(length:--step-3)">
          From {l.fromMonthly} per month{l.minimumTermMonths ? `, ${l.minimumTermMonths}-month minimum` : ""}.
        </p>
      ) : (
        <p className="mt-4 text-(length:--step--1) text-slate">Lease terms and indicative monthly pricing confirmed in writing at quotation.</p>
      )}
      <div className="mt-6">
        <ButtonLink href="/contact?enquiry=pricing" variant="secondary" size="sm">Ask about pricing</ButtonLink>
      </div>
    </div>
  );
}
