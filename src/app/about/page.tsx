import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoBlock, SupportStrip } from "@/components/site/Blocks";

export const metadata: Metadata = pageMetadata({
  title: "About Carebot UK | Robotics expertise and business experience",
  description: "A UK service robotics team with over 100 years of combined operations and technology experience. Expert guidance, installation, training and ongoing support.",
  path: "/about",
});

const team = [
  { role: "Robotics and integration", body: "Practical expertise in robot configuration, route mapping, building integration and maintenance. We assess how the technology will work in your premises and support it throughout everyday use." },
  { role: "Business operations", body: "Experience running businesses and managing the demands of people, service and cost. We start with your operational priorities and identify where a robot could make a useful contribution." },
  { role: "Implementation and training", body: "Coordinated site assessment, installation and staff training, with clear responsibilities at each stage. Your team knows how to use the robot and who to contact when they need help." },
];

const commitments = [
  "A recommendation grounded in your business needs, building and working practices.",
  "Clear scope, costs and responsibilities before you commit to an installation.",
  "A planned introduction, with staff training and agreed procedures for day-to-day use.",
  "Ongoing UK engineering support, maintenance and access to spare parts.",
];

export default function AboutPage() {
  return (
    <>
      <Section band="sage">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="mb-4 text-sm font-medium text-accent">Your UK robotics partner</p>
          <h1>Robotics expertise. Business understanding.</h1>
          <p className="mt-6 text-(length:--step-1) text-slate">
            Introducing robotics is a significant decision for your business. Carebot UK brings together robotics expertise and over 100 years of combined operations and technology experience to help you make that decision with confidence—and put it into practice.
          </p>
        </div>
      </Section>

      <Section band="mist" ariaLabelledBy="who-heading">
        <SectionHeading id="who-heading" title="An experienced team behind your investment" />
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose">
            <p>Our team combines experience in business operations, technology and robotics engineering. We understand that introducing a robot affects how people work, how a building is used and how service is delivered. Each of those considerations shapes our recommendations.</p>
            <p>We supply, install and support commercial service robots for care homes, hospitals, restaurants, hotels and retail businesses. From assessing the opportunity and selecting equipment to integration, staff training and maintenance, we take responsibility for helping you turn a technology investment into a practical part of your operation.</p>
            <p>You work with a UK team that brings commercial and technical judgement to the same conversation. We explain what the robot can do, what your premises need and how your staff will use it, so you can make an informed decision about suitability and cost.</p>
          </div>
          <ul className="space-y-6">
            {team.map((t) => (
              <li key={t.role} className="rounded-3xl bg-paper p-6">
                <h3>{t.role}</h3>
                <p className="mt-2 text-slate">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section band="paper" ariaLabelledBy="mfr-heading">
        <SectionHeading id="mfr-heading" title="Robotics technology, backed by UK expertise" lede="Our current product range is from Pudu Robotics. We also have distribution relationships with LimX Dynamics and Reeman; those ranges are under evaluation for UK supply and support." />
        <div className="grid gap-8 md:grid-cols-3">
          {site.manufacturers.map((m) => (
            <div key={m.slug} className="border-t border-stone pt-6">
              <h3>{m.name}</h3>
              <p className="mt-2 text-slate">
                {m.slug === "pudu-robotics"
                  ? "The manufacturer behind FlashBot Max and KettyBot Pro. Explore delivery, service and reception robots with installation and support from Carebot UK."
                  : m.slug === "limx-dynamics"
                    ? "Legged and humanoid robotics. We are evaluating this range for future UK supply, with installation and support requirements assessed before adding products."
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
            <h2 id="facility-heading">Evaluate the technology with our team</h2>
            <p className="mt-5 text-slate">
              At our Northfleet demonstration facility, you can see FlashBot Max and KettyBot Pro in action, try the controls and discuss your requirements with our team. It is an opportunity to assess the technology and understand what an installation would involve before deciding how to proceed.
            </p>
          </div>
          <div className="rounded-3xl bg-sage p-8"><h3>Start with your business priorities.</h3><p className="mt-4 text-slate">Tell us where repeated deliveries, carrying or service demands put pressure on your team. We will help you assess the relevant model, the changes needed at your premises and the purchase or lease options available.</p></div>
        </div>
      </Section>

      <Section band="paper" ariaLabelledBy="commitments-heading">
        <SectionHeading id="commitments-heading" title="A clear plan. Support at every stage." />
        <ul className="max-w-3xl space-y-4">
          {commitments.map((n) => (
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
    </>
  );
}
