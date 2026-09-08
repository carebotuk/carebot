"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

export type GridItem = { slug: string; industries: string[]; card: ReactNode };

type Props = {
  items: GridItem[];
  industries: { slug: string; name: string }[];
  initialIndustry?: string;
};

/** Filterable three-up grid. Cards are rendered on the server and passed in. */
export function ProductGrid(props: Props) {
  return (
    <Suspense fallback={<Grid {...props} />}>
      <GridWithQuery {...props} />
    </Suspense>
  );
}

function GridWithQuery(props: Props) {
  const sp = useSearchParams();
  const q = sp.get("industry");
  const initial = q && props.industries.some((i) => i.slug === q) ? q : props.initialIndustry;
  return <Grid {...props} initialIndustry={initial} />;
}

function Grid({ items, industries, initialIndustry = "all" }: Props) {
  const [industry, setIndustry] = useState(initialIndustry);
  const visible = useMemo(
    () => (industry === "all" ? items : items.filter((p) => p.industries.includes(industry))),
    [industry, items],
  );
  return (
    <div>
      <div role="group" aria-label="Filter robots by industry" className="mb-8 flex flex-wrap gap-2">
        {[{ slug: "all", name: "All" }, ...industries].map((i) => {
          const active = i.slug === industry;
          return (
            <button
              key={i.slug}
              type="button"
              aria-pressed={active}
              onClick={() => setIndustry(i.slug)}
              className={`rounded-full border px-4 py-2 text-(length:--step--1) transition-colors ${active ? "border-ink bg-ink text-paper" : "border-stone hover:border-ink"}`}
            >
              {i.name}
            </button>
          );
        })}
      </div>
      {visible.length ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => <li key={p.slug}>{p.card}</li>)}
        </ul>
      ) : (
        <p className="text-slate">No robots listed for that industry yet.</p>
      )}
    </div>
  );
}
