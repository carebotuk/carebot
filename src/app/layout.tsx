import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], display: "swap", style: ["normal", "italic"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.siteName} | Service robots for care homes, hotels and hospitality`, template: `%s | ${site.siteName}` },
  description: site.tagline,
  openGraph: { siteName: site.siteName, locale: "en_GB", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${newsreader.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Analytics />
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
