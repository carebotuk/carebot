import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { localBusinessJsonLd, pageMetadata } from "@/lib/seo";
import { demoAddress, site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ClosingCta } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Book a demo | See a service robot working in Kent",
  description: `See two service robots working and operate them yourself at our demonstration facility in Northfleet, Kent. Forty-five minutes, by appointment. Or we will come to you for a site survey.`,
  path: "/demo",
});

const expect = [
  "Forty-five minutes, at a time that suits you.",
  "Two robots on site, working, that you operate yourself.",
  "Bring your corridor measurements and a floor plan if you have one. We will run the robot through a scenario like yours.",
  "Bring the people who will use it. Staff acceptance decides whether a deployment works.",
  "No sales pitch. If we think it will not work in your building, we say so.",
];

export default async function DemoPage() {
  const products = await getProducts();
  const d = site.demoFacility;
  const cal = process.env.NEXT_PUBLIC_CAL_LINK;
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Book a demo", href: "/demo" }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-2xl">
            <p className="text-slate">Demonstration facility, {d.byAppointment ? "by appointment" : "open weekdays"}</p>
            <h1 className="mt-3">See a robot working before you decide.</h1>
            <p className="mt-6 text-(length:--step-1) text-slate">
              Most people who visit Northfleet have never stood next to a service robot. Forty-five minutes here answers more questions than a month of reading. Two robots on site, working, and you drive them.
            </p>
            <p className="mt-4 text-slate">Prefer us to come to you? We will do a site survey at your home, measure your corridors and lift, and give you a written feasibility assessment.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#book">Book a slot</ButtonLink>
              <ButtonLink href="/contact?enquiry=survey" variant="secondary">Request a site survey</ButtonLink>
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-stone p-6 sm:p-8">
            <h2 className="text-(length:--step-2)">Where</h2>
            <address className="mt-3 not-italic">
              {d.name}<br />
              {d.line1}<br />
              {d.city}, {d.county} {d.postcode}
            </address>
            <p className="mt-4 text-slate">
              <strong className="font-medium text-ink">By rail:</strong> {d.nearestStation} station, then a short walk. Trains from London St Pancras, Charing Cross and Victoria via Gravesend.
            </p>
            <p className="mt-2 text-slate"><strong className="font-medium text-ink">By car:</strong> off the A226, close to the A2 and Dartford Crossing. Parking on site.</p>
            <a href={d.mapLinkUrl} target="_blank" rel="noopener" className="mt-4 inline-block font-medium text-accent underline-offset-4 hover:underline">Open in Google Maps</a>
          </div>
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="expect-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="expect-heading">What to expect</h2>
            <ul className="mt-8 space-y-4">
              {expect.map((e) => (
                <li key={e} className="flex gap-4">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[var(--radius)] border border-stone bg-paper">
            <iframe
              title={`Map showing ${demoAddress()}`}
              src={d.mapEmbedUrl}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      <Section band="paper" id="book" ariaLabelledBy="book-heading" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="book-heading">Book your visit</h2>
            <p className="mt-4 text-slate">
              {cal ? "Pick a time that suits you. You will get a calendar invite with directions." : "Tell us who you are and roughly when suits, and we will confirm a time within one working day."}
            </p>
            {site.phone ? <p className="mt-4 text-slate">Or call <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-medium text-ink underline-offset-4 hover:underline">{site.phone}</a>.</p> : null}
          </div>
          <div>
            {cal ? (
              <iframe src={`${cal}?embed=true&theme=light`} title="Booking calendar" className="h-[42rem] w-full rounded-[var(--radius)] border border-stone" loading="lazy" />
            ) : (
              <EnquiryForm products={products.map((p) => ({ slug: p.slug, name: p.name }))} defaultType="demo" lockType readQuery submitLabel="Request a demo slot" />
            )}
          </div>
        </div>
      </Section>

      <ClosingCta title="Not ready to visit yet?" body="Read the operations director's guide first, or send us a question. We reply within one working day." />
    </>
  );
}
