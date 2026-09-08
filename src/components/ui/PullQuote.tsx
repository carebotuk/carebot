export function PullQuote({ quote, attribution, role }: { quote: string; attribution?: string; role?: string }) {
  return (
    <figure className="max-w-3xl">
      <blockquote className="font-serif text-(length:--step-3) leading-[1.3] tracking-tight">“{quote}”</blockquote>
      {attribution ? (
        <figcaption className="mt-4 text-slate">
          {attribution}
          {role ? <span>, {role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
