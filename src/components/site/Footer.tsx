import Link from "next/link";
import { getIndustries, getProducts, getServices } from "@/lib/content";
import { demoAddress, fullAddress, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-(length:--step--1) font-medium text-stone">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="text-paper/85 hover:text-paper hover:underline underline-offset-4">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const [products, industries, services] = await Promise.all([getProducts(), getIndustries(), getServices()]);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="text-(length:--step-1)">{site.tagline}</p>
            <p className="mt-6 text-paper/85">{site.supportCommitment}</p>
            <p className="mt-6 text-(length:--step--1) text-stone">
              Demonstrations {site.demoFacility.byAppointment ? "by appointment" : ""} at {demoAddress()}.
            </p>
          </div>
          <Col title="Products" links={products.map((p) => ({ label: p.name, href: `/products/${p.slug}` }))} />
          <Col title="Industries" links={industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` }))} />
          <Col title="Services" links={services.slice(0, 6).map((s) => ({ label: s.name, href: `/services#${s.slug}` }))} />
          <Col
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Book a demo", href: "/demo" },
              { label: "Resources", href: "/resources" },
              { label: "Contact", href: "/contact" },
              { label: "LinkedIn", href: site.linkedin },
            ]}
          />
        </div>

        <div className="mt-16 border-t border-paper/15 pt-10">
          <p aria-hidden="true" className="select-none text-[clamp(3rem,12vw,9rem)] font-semibold leading-none tracking-[-0.05em] text-paper/95">
            Carebot UK
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6 text-(length:--step--1) text-stone md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p>{site.legalName}{site.companyNumber ? `, company number ${site.companyNumber}` : ""}. Registered in England and Wales.</p>
            <p>Registered office: {fullAddress()}.</p>
            {site.phone ? <p><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-paper">{site.phone}</a></p> : null}
            <p><a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a></p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/privacy" className="hover:text-paper">Privacy</Link></li>
            <li><Link href="/cookies" className="hover:text-paper">Cookies</Link></li>
            <li><Link href="/terms" className="hover:text-paper">Terms</Link></li>
            <li>© {year} {site.siteName}</li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
