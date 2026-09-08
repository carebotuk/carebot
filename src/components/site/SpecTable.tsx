import type { ProductFrontmatter } from "@/lib/content/schemas";

type Spec = ProductFrontmatter["specs"][number];
const groupOrder = ["Physical", "Performance", "Navigation", "Integration", "Software"];

/** Real tables, grouped, collapsible on mobile via details/summary. */
export function SpecTable({ specs, manufacturer }: { specs: Spec[]; manufacturer: string }) {
  const groups = groupOrder.map((g) => ({ g, rows: specs.filter((s) => s.group === g) })).filter((x) => x.rows.length);
  return (
    <div className="max-w-3xl space-y-4">
      {groups.map(({ g, rows }, idx) => (
        <details key={g} open={idx === 0} className="group rounded-[var(--radius)] border border-stone md:[&[open]]:block md:open">
          <summary className="flex items-center justify-between px-5 py-4 text-(length:--step-1) font-medium md:cursor-default">
            {g}
            <span aria-hidden="true" className="text-slate transition-transform group-open:rotate-180 md:hidden">▾</span>
          </summary>
          <table className="w-full border-t border-stone text-(length:--step--1)">
            <caption className="sr-only">{g} specifications for this robot, as stated by {manufacturer}</caption>
            <thead className="sr-only"><tr><th scope="col">Specification</th><th scope="col">Value</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-stone last:border-0">
                  <th scope="row" className="w-2/5 px-5 py-3 text-left font-normal text-slate">{r.label}</th>
                  <td className="px-5 py-3">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
      <p className="text-(length:--step--1) text-slate">All figures are as stated by {manufacturer}. Granular specifications such as sensor part numbers and IP ratings are in the datasheet.</p>
    </div>
  );
}
