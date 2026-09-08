import Link from "next/link";
import type { Resource } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";
import { Arrow } from "@/components/ui/Button";

const typeLabel: Record<Resource["resourceType"], string> = {
  guide: "Guide",
  "case-study": "Case study",
  checklist: "Checklist",
  "roi-model": "ROI model",
  article: "Article",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group flex h-full flex-col rounded-[var(--radius)] border border-stone bg-paper p-6 transition-colors hover:border-ink">
      <div className="flex flex-wrap gap-2">
        <Chip>{typeLabel[resource.resourceType]}</Chip>
        {resource.status === "coming-soon" ? <Chip tone="accent">Coming soon</Chip> : null}
      </div>
      <h3 className="mt-5">{resource.title}</h3>
      <p className="mt-3 text-slate">{resource.summary}</p>
      <span className="mt-auto flex items-center gap-2 pt-8 font-medium">
        {resource.isGated ? "Get it by email" : "Read"} <Arrow />
      </span>
    </Link>
  );
}
