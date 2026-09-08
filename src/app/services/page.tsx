import type { Metadata } from "next";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PullQuote } from "@/components/ui/PullQuote";
import { ClosingCta, DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "Robot installation and support UK | Implementation and after-sales",
  description: "Site survey, specification, installation, route mapping, staff training and 24-hour UK support for service robots. What Carebot UK does after the robot arrives.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} />
        <div className="mt-8 max-w-3xl">
          <h1>What happens after it arrives.</h1>
          <p className="mt-6 text-(length:--step-1) text-slate">
            Anyone can list a robot. The question a care operator actually has is what happens after it is delivered, and who fixes it at seven on a Tuesday morning. This is our answer.
          </p>
        </div>
      </Section>

      <Section band="mist">
        <ol className="max-w-3xl divide-y divide-stone border-y border-stone">
          {services.map((s, i) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-24 py-8">
              <div className="grid gap-4 sm:grid-cols-[3rem_1fr]">
                <span className="font-serif text-(length:--step-3) leading-none text-accent">{i + 1}</span>
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
          <PullQuote quote="We would rather tell you it will not work in your building than install something that does not." />
          <div>
            <h2 className="text-(length:--step-3)">The support commitment</h2>
            <p className="mt-4 text-slate">{site.supportCommitment} Emergency response is prioritised. The definition of an emergency, hours of cover and spare parts holding are set out in writing at quotation, so there is no ambiguity later.</p>
          </div>
        </div>
        <div className="mt-12"><SupportStrip /></div>
      </Section>

      <DemoBlock />
      <ClosingCta />
    </>
  );
}
