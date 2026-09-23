import type { Metadata } from "next";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Robot installation and support UK | Implementation and after-sales",
  description: "Site survey, specification, installation, route mapping, staff training and 24-hour UK support for service robots. What Carebot UK does after the robot arrives.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Section band="sage">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="mb-4 text-sm font-medium text-accent">From first survey to everyday support</p>
          <h1>We get your robot working. And help you keep it working.</h1>
          <p className="mt-6 text-(length:--step-1) text-slate">
            Buying the robot is one part of the decision. You also need suitable routes, trained staff and reliable help when something interrupts service. Carebot UK handles the assessment, installation and ongoing support.
          </p>
        </div>
      </Section>

      <Section band="mist">
        <ol className="grid gap-6 lg:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-24 rounded-3xl border border-stone bg-paper p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-[3rem_1fr]">
                <span className="text-sm font-medium text-accent">{i + 1}</span>
                <div>
                  <h2 className="text-(length:--step-2)">{s.name}</h2>
                  <p className="mt-2 font-medium">{s.summary}</p>
                  <div className="prose mt-3 text-slate" dangerouslySetInnerHTML={{ __html: s.html }} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section band="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div><h2 className="text-(length:--step-3)">Know what you are buying.</h2><p className="mt-4 text-slate">Your quotation sets out the recommended robot, installation work and support terms. We explain what your team needs to do and any building changes required before you decide.</p></div>
          <div>
            <h2 className="text-(length:--step-3)">The support commitment</h2>
            <p className="mt-4 text-slate">{site.supportCommitment} Emergency response is prioritised. The definition of an emergency, hours of cover and spare parts holding are set out in writing at quotation, so there is no ambiguity later.</p>
          </div>
        </div>
        <div className="mt-12"><SupportStrip /></div>
      </Section>

      <DemoBlock />
    </>
  );
}
