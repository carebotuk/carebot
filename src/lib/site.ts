import settings from "../../content/site-settings.json";

export const site = settings;
export type SiteSettings = typeof settings;

export const categoryLabels: Record<string, string> = {
  delivery: "Delivery",
  cleaning: "Cleaning",
  reception: "Reception and service",
};

export function manufacturerName(slug: string): string {
  return site.manufacturers.find((m) => m.slug === slug)?.name ?? slug;
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, site.domain).toString();
}

export function fullAddress(): string {
  const a = site.registeredAddress;
  return [a.line1, a.line2, a.city, a.postcode].filter(Boolean).join(", ");
}

export function demoAddress(): string {
  const d = site.demoFacility;
  return [d.line1, d.city, d.county, d.postcode].filter(Boolean).join(", ");
}
