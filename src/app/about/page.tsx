import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PullQuote } from "@/components/ui/PullQuote";
import { ClosingCta, DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "About Carebot UK | UK distributor and integrator for service robots",
  description: "Who Carebot UK is, who the manufacturers are, and what we do and do not do. Owner-operated, UK-based engineer, demonstration facility in Kent.",
  path: "/about",
});

const team = [
  { role: "Robotics engineer", body: "Full-time and UK-based. Installs and maintains every machine we sell, and is the person behind the 24-hour response commitment. Every competitor claims UK support; this is what ours consists of." },
  { role: "Sales lead", body: "Years of experience selling into UK care homes. Understands registered managers, procurement panels and inspection pressure, because that has been the job." },
  { role: "Operations manager", body: "Runs each deployment end to end, from survey booking to sign-off and the first support call." },
];

const notDo = [
  "We do not sell warehouse or industrial robots. Our robots are for corridors, dining rooms and shop floors.",
  "We do not claim outcomes we have not measured. There are no percentage savings on this site because we do not yet have a UK deployment to measure them on.",
  "We do not install and leave. If a survey tells us your building will not suit a robot, we say so and do not sell you one.",
  "We do not borrow other people's credibility. Where the manufacturers have earned an award or a deployment, it is attributed to them.",
];

export default function AboutPage() {
  return (
    <>
      <Section band="paper">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
        <div className="mt-8 max-w-3xl">
          <h1>A team, not a catalogue.</h1>
          <p className="mt-6 text-(length:--step-1) text-slate">
            Carebot UK is the UK distribution partner for {site.manufacturers.map((m) => m.name).join(", ").replace(/, ([^,]*)$/, " and $1")}. What the manufacturers cannot offer from overseas is someone who will come to your home, measure your corridors, and answer the phone when something goes wrong. That is us.
          </p>
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="who-heading">
        <SectionHeading id="who-heading" title="Who we are" />
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose">
            <p>Carebot UK is owner-operated by three founders, with a full-time UK team: a robotics engineer who installs and maintains every machine we sell, a sales lead with years of experience selling into UK care homes, and an operations manager who runs deployments end to end.</p>
            <p>Between the founders we have spent over twenty years building and operating businesses in consumer goods, technology and education. We are new to care robotics. We are not new to running operations, or to being the people who answer the phone.</p>
            <p>We describe the team by role rather than by name for now. The roles are what matter to the buyer: who fixes it, who understands a care home, and who is accountable for the deployment.</p>
          </div>
          <ul className="space-y-6">
            {team.map((t) => (
              <li key={t.role} className="rounded-[var(--radius)] bg-paper p-6">
                <h3>{t.role}</h3>
                <p className="mt-2 text-slate">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section band="paper" ariaLabelledBy="mfr-heading">
        <SectionHeading id="mfr-heading" title="The manufacturers" lede="Every credibility claim on this site is attributed to whoever earned it." />
        <div className="grid gap-8 md:grid-cols-3">
          {site.manufacturers.map((m) => (
            <div key={m.slug} className="border-t border-stone pt-6">
              <h3>{m.name}</h3>
              <p className="mt-2 text-slate">
                {m.slug === "pudu-robotics"
                  ? "Pudu's service robots are deployed in hotels, restaurants and healthcare facilities across many countries, and Pudu's product design has been recognised with Red Dot and iF Design awards. Those are Pudu's customers and Pudu's awards. Our job is the UK deployment and support."
                  : m.slug === "limx-dynamics"
                    ? "Legged and humanoid robotics for research and, in time, service settings. Not part of the launch range, and we will not list a product until we can support it."
                    : "Reception, guidance and delivery robots. Range under evaluation for the UK; products will be listed as they are verified and supportable."}
              </p>
              <a href={m.url} target="_blank" rel="noopener" className="mt-3 inline-block text-(length:--step--1) text-accent underline-offset-4 hover:underline">{m.url.replace("https://", "")}</a>
            </div>
          ))}
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="facility-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="facility-heading">A place you can visit this week</h2>
            <p className="mt-5 text-slate">
              Our demonstration facility in Northfleet, Kent, has two robots working that you can operate yourself. It exists because no amount of copy replaces standing next to the machine. It is also where our engineer is based, which is why support is measured in hours.
            </p>
          </div>
          <PullQuote quote="We are new to care robotics. We are not new to running operations, or to being the people who answer the phone." attribution="The founders" />
        </div>
      </Section>

      <Section band="paper" ariaLabelledBy="notdo-heading">
        <SectionHeading id="notdo-heading" title="What we don't do" />
        <ul className="max-w-3xl space-y-4">
          {notDo.map((n) => (
            <li key={n} className="flex gap-4">
              <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-14"><SupportStrip /></div>
      </Section>

      <Section band="mist" ariaLabelledBy="company-heading">
        <h2 id="company-heading" className="text-(length:--step-2)">Company details</h2>
        <dl className="mt-6 grid max-w-3xl gap-x-12 gap-y-4 sm:grid-cols-[12rem_1fr]">
          <dt className="text-slate">Legal entity</dt><dd>{site.legalName}</dd>
          <dt className="text-slate">Registered office</dt><dd>{fullAddress()}</dd>
          {site.companyNumber ? <><dt className="text-slate">Company number</dt><dd>{site.companyNumber}</dd></> : null}
          {site.icoRegistration ? <><dt className="text-slate">ICO registration</dt><dd>{site.icoRegistration}</dd></> : null}
          <dt className="text-slate">LinkedIn</dt><dd><a href={site.linkedin} className="text-accent underline-offset-4 hover:underline" target="_blank" rel="noopener">Carebot UK on LinkedIn</a></dd>
        </dl>
      </Section>

      <DemoBlock />
      <ClosingCta />
    </>
  );
}
