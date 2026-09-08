import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const inputCls =
  "block w-full rounded-[var(--radius-sm)] border border-stone bg-paper px-4 py-3 text-ink placeholder:text-slate/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-alert";

export function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium">{label}</label>
      {hint ? <p id={`${id}-hint`} className="mt-1 text-(length:--step--1) text-slate">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? <p id={`${id}-error`} role="alert" className="mt-1.5 text-(length:--step--1) text-alert">{error}</p> : null}
    </div>
  );
}

export function Input({ error, ...props }: ComponentProps<"input"> & { error?: string }) {
  return <input className={inputCls} aria-invalid={error ? true : undefined} aria-describedby={error ? `${props.id}-error` : undefined} {...props} />;
}

export function Select({ error, children, ...props }: ComponentProps<"select"> & { error?: string }) {
  return (
    <select className={inputCls} aria-invalid={error ? true : undefined} aria-describedby={error ? `${props.id}-error` : undefined} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ error, ...props }: ComponentProps<"textarea"> & { error?: string }) {
  return <textarea className={`${inputCls} min-h-32`} aria-invalid={error ? true : undefined} {...props} />;
}

export function ConsentCheckbox({ id, wording, ...props }: ComponentProps<"input"> & { wording: string }) {
  return (
    <div className="flex gap-3">
      <input id={id} type="checkbox" className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--accent)]" {...props} />
      <label htmlFor={id} className="text-(length:--step--1) text-slate">{wording}</label>
    </div>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-(length:--step--1) text-slate">
      We use your details to respond to this request. Read our <Link href="/privacy" className="underline underline-offset-4">privacy notice</Link>.
    </p>
  );
}

export function Honeypot({ register }: { register: () => ComponentProps<"input"> }) {
  return (
    <div className="absolute -left-[9999px] top-0" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register()} />
    </div>
  );
}
