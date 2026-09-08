/** Serif stat callout with mandatory source line. */
export function Stat({ value, label, source }: { value: string; label: string; source: string }) {
  return (
    <div className="border-t border-stone pt-5">
      <p className="font-serif text-(length:--step-5) leading-none tracking-tight">{value}</p>
      <p className="mt-3 font-medium">{label}</p>
      <p className="mt-1 text-(length:--step--1) text-slate">Source: {source}</p>
    </div>
  );
}
