import Link from "next/link";
import { getIndustries, getProducts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Nav, type NavItem } from "./Nav";
import { Wordmark } from "./Wordmark";

export async function Header() {
  const [products, industries] = await Promise.all([getProducts(), getIndustries()]);
  const items: NavItem[] = [
    { label: "Products", href: "/products", children: products.map((p) => ({ label: p.name, href: `/products/${p.slug}`, description: p.tagline })) },
    { label: "Industries", href: "/industries", children: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })) },
    { label: "Services", href: "/services" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-stone bg-paper/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="Carebot UK home">
          <Wordmark className="h-6" />
        </Link>
        <Nav items={items} />
      </Container>
    </header>
  );
}
