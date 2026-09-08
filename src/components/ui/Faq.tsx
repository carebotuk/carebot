type Item = { question: string; answer: string };

export function Faq({ items, heading = "Frequently asked questions", id = "faq" }: { items: Item[]; heading?: string; id?: string }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 id={id} className="mb-8">{heading}</h2>
      <div className="max-w-3xl divide-y divide-stone border-y border-stone">
        {items.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex items-start justify-between gap-6 text-(length:--step-1) font-medium">
              <span>{f.question}</span>
              <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone text-slate transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-slate">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
