import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import { LegalPage } from "@/components/site/Legal";

export const metadata: Metadata = pageMetadata({ title: "Website terms", description: "Terms of use for the Carebot UK website.", path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage title="Website terms" href="/terms" updated="7 September 2026">
      <p>This website is operated by {site.legalName}, {fullAddress()}. By using it you agree to these terms.</p>
      <h2>Product information</h2>
      <p>Product descriptions and specifications are provided in good faith and, where stated, are as published by the manufacturer. Manufacturers revise hardware, and figures are confirmed at the point of quotation. Nothing on this site is an offer capable of acceptance; a contract is formed only on a written quotation and order.</p>
      <h2>Pricing and availability</h2>
      <p>Indicative lease or purchase figures, where shown, are subject to survey, configuration and credit approval. Availability is confirmed at quotation.</p>
      <h2>Trademarks</h2>
      <p>Manufacturer names and product names are trademarks of their respective owners and are used to identify the products we distribute.</p>
      <h2>Liability</h2>
      <p>We do not exclude liability for death or personal injury caused by negligence, or for anything else that cannot be excluded by law. Otherwise, the site is provided as is and we are not liable for loss arising from reliance on its content.</p>
      <h2>Law</h2>
      <p>These terms are governed by the law of England and Wales.</p>
    </LegalPage>
  );
}
