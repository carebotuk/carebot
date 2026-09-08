import Link from "next/link";
import type { Industry } from "@/lib/content";
import { Arrow } from "@/components/ui/Button";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link href={`/industries/${industry.slug}`} className="group flex h-full flex-col justify-between rounded-[var(--radius)] border border-stone bg-paper p-6 transition-colors hover:border-ink">
      <div>
        <h3>{industry.name}</h3>
        <p className="mt-3 text-slate">{industry.intro}</p>
      </div>
      <span className="mt-8 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper"><Arrow /></span>
    </Link>
  );
}
