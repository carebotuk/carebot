export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 font-semibold tracking-[-0.03em] ${className}`} style={{ fontSize: "1.375rem", lineHeight: 1 }}>
      <span>Carebot</span>
      <span className="text-accent">UK</span>
    </span>
  );
}
