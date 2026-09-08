import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/Legal";
import { CookieSettingsLink } from "@/components/site/CookieBanner";

export const metadata: Metadata = pageMetadata({ title: "Cookie policy", description: "The cookies this site sets and how to change your choice.", path: "/cookies" });

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie policy" href="/cookies" updated="7 September 2026">
      <p>This site sets no cookies until you make a choice, apart from the one that remembers the choice itself.</p>
      <h2>Strictly necessary</h2>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>cb-consent-v1</td><td>Stores whether you accepted or rejected analytics cookies (local storage).</td><td>Until cleared</td></tr>
        </tbody>
      </table>
      <h2>Analytics (optional)</h2>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>_ga, _ga_*</td><td>Google Analytics 4. Counts visits and which pages are read. IP addresses are anonymised. Set only after you accept.</td><td>Up to 2 years</td></tr>
        </tbody>
      </table>
      <p>Google Consent Mode v2 is configured so that analytics storage is denied by default and advertising storage is always denied.</p>
      <h2>Change your choice</h2>
      <p><CookieSettingsLink /></p>
    </LegalPage>
  );
}
