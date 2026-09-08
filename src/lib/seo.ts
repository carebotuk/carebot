import type { Metadata } from "next";
import { absoluteUrl, site, demoAddress } from "./site";

type Args = { title: string; description: string; path: string; ogImage?: string; noIndex?: boolean };

export function pageMetadata({ title, description, path, ogImage, noIndex }: Args): Metadata {
  const url = absoluteUrl(path);
  const image = ogImage ? absoluteUrl(ogImage) : absoluteUrl("/opengraph-image");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.siteName, type: "website", locale: "en_GB", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function organizationJsonLd() {
  const a = site.registeredAddress;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.siteName,
    legalName: site.legalName,
    url: site.domain,
    logo: absoluteUrl("/logo.webp"),
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    address: { "@type": "PostalAddress", streetAddress: `${a.line1}, ${a.line2}`, addressLocality: a.city, postalCode: a.postcode, addressCountry: "GB" },
    sameAs: [site.linkedin].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: site.domain,
    name: site.siteName,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/products?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd() {
  const d = site.demoFacility;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${site.siteName} demonstration facility`,
    parentOrganization: { "@id": absoluteUrl("/#organization") },
    url: absoluteUrl("/demo"),
    ...(site.phone ? { telephone: site.phone } : {}),
    email: site.email,
    address: { "@type": "PostalAddress", streetAddress: d.line1, addressLocality: d.city, addressRegion: d.county, postalCode: d.postcode, addressCountry: "GB" },
    description: `Service robot demonstrations by appointment at ${demoAddress()}.`,
  };
}
