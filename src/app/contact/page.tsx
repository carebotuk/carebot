import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { demoAddress, fullAddress, site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact Carebot UK",
  description: "Book a demo, request a site survey or ask a question. Registered in London, demonstrations in Northfleet, Kent. We reply within one working day.",
  path: "/contact",
});

export default async function ContactPage() {
  const products = await getProducts();
  return (
    <>
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h1>Get in touch</h1>
            <p className="mt-5 text-(length:--step-1) text-slate">The fastest way to a decision is a demo at Northfleet. For anything else, the form is read by a person and answered within one working day.</p>
            <div className="mt-8"><ButtonLink href="/demo">Book a demo</ButtonLink></div>

            <dl className="mt-12 space-y-6 text-slate">
              <div>
                <dt className="font-medium text-ink">Demonstration facility</dt>
                <dd className="mt-1">{demoAddress()}{site.demoFacility.byAppointment ? ". By appointment." : ""}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Registered office</dt>
                <dd className="mt-1">{site.legalName}<br />{fullAddress()}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Email</dt>
                <dd className="mt-1"><a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">{site.email}</a></dd>
              </div>
              {site.phone ? (
                <div>
                  <dt className="font-medium text-ink">Phone</dt>
                  <dd className="mt-1"><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{site.phone}</a></dd>
                </div>
              ) : null}
              <div>
                <dt className="font-medium text-ink">Support</dt>
                <dd className="mt-1">{site.supportCommitment}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-[var(--radius)] border border-stone p-6 sm:p-8">
            <EnquiryForm products={products.map((p) => ({ slug: p.slug, name: p.name }))} readQuery />
          </div>
        </div>
      </Section>
    </>
  );
}
