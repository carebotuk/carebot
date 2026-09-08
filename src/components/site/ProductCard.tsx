import Link from "next/link";
import type { Product } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import { categoryLabels, manufacturerName } from "@/lib/site";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const src = resolveImage(product.heroImage);
  return (
    <article className="flex h-full flex-col rounded-[var(--radius)] border border-stone bg-paper p-4">
      <Link href={`/products/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <ImageFrame src={src} alt={product.heroImageAlt ?? product.name} priority={priority} label="Image to follow" />
      </Link>
      <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
        <p className="text-(length:--step--1) text-slate">{manufacturerName(product.manufacturer)}</p>
        <h3 className="mt-1">
          <Link href={`/products/${product.slug}`} className="hover:underline underline-offset-4">{product.name}</Link>
        </h3>
        <p className="mt-2 text-slate">{product.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>{categoryLabels[product.category]}</Chip>
          {product.status === "coming-soon" ? <Chip tone="accent">Coming soon</Chip> : null}
          {product.availability === "both" ? <Chip>Buy or lease</Chip> : null}
        </div>
        <div className="mt-auto pt-6">
          <ButtonLink href={`/products/${product.slug}`} variant="secondary" full>
            View {product.name}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
