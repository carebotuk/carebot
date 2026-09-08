import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import { LegalPage } from "@/components/site/Legal";

export const metadata: Metadata = pageMetadata({ title: "Privacy notice", description: "How Carebot UK collects and uses personal data.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice" href="/privacy" updated="7 September 2026">
      <h2>Who we are</h2>
      <p>{site.legalName}, registered office {fullAddress()}{site.companyNumber ? `, company number ${site.companyNumber}` : ""}, is the data controller for personal data collected through this website.{site.icoRegistration ? ` Our ICO registration number is ${site.icoRegistration}.` : ""} Contact us about your data at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

      <h2>What we collect and why</h2>
      <p><strong>Enquiry and demo forms.</strong> Name, work email, organisation, role, sector, robot of interest, optional phone number and your message. We use these to respond to your enquiry and arrange a demonstration or survey. Lawful basis: legitimate interests (responding to a business enquiry you initiated), and where a contract follows, performance of that contract.</p>
      <p><strong>Resource downloads.</strong> Name, work email, organisation, role, sector and optional phone. We email you a link to the document you requested. Lawful basis: legitimate interests in delivering the asset you asked for.</p>
      <p><strong>Marketing.</strong> Only if you tick the unticked consent box on a form. We record the date and time, your IP address, the form version and the exact wording you agreed to. Lawful basis: consent, which you can withdraw at any time by emailing us or using the unsubscribe link in any email.</p>
      <p><strong>Analytics.</strong> Google Analytics, only after you accept analytics cookies. See the <Link href="/cookies">cookie policy</Link>.</p>

      <h2>Where your data goes</h2>
      <p>Enquiries and download requests are stored in HubSpot, our customer relationship system. Emails are sent through Resend. The website is hosted on Vercel. These providers process data on our instructions and may store it outside the UK under appropriate safeguards, including the UK International Data Transfer Addendum.</p>

      <h2>How long we keep it</h2>
      <p>Enquiry data is kept for as long as we are in an active conversation with you and for up to three years afterwards, unless a contract follows. Consent records are kept for as long as the consent is relied on and for a period afterwards to evidence it.</p>

      <h2>Your rights</h2>
      <p>You can ask for a copy of your data, ask us to correct or delete it, object to processing, or withdraw consent. Email <a href={`mailto:${site.email}`}>{site.email}</a>. You can also complain to the Information Commissioner&rsquo;s Office at ico.org.uk.</p>
    </LegalPage>
  );
}
