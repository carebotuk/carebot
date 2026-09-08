"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

export type NavItem = { label: string; href: string; children?: { label: string; href: string; description?: string }[] };

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg>
  );
}

function Dropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const id = useId();
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => (e.detail === 0 ? setOpen((o) => !o) : setOpen(true))}
        className={`flex items-center gap-1 rounded-full px-3 py-2 hover:bg-mist ${active ? "text-accent" : ""}`}
      >
        {item.label}
        <Chevron />
      </button>
      <div id={id} hidden={!open} className="absolute left-0 top-full z-40 pt-2">
        <ul className="min-w-[18rem] rounded-[var(--radius)] border border-stone bg-paper p-2 shadow-[0_12px_40px_-12px_rgba(28,27,25,0.25)]">
          <li>
            <Link href={item.href} className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium hover:bg-mist" onClick={() => setOpen(false)}>
              All {item.label.toLowerCase()}
            </Link>
          </li>
          {item.children?.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="block rounded-[var(--radius-sm)] px-3 py-2 hover:bg-mist" onClick={() => setOpen(false)}>
                <span className="block">{c.label}</span>
                {c.description ? <span className="block text-(length:--step--1) text-slate">{c.description}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Nav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {items.map((item) =>
            item.children?.length ? (
              <Dropdown key={item.href} item={item} active={isActive(item.href)} />
            ) : (
              <li key={item.href}>
                <Link href={item.href} className={`block rounded-full px-3 py-2 hover:bg-mist ${isActive(item.href) ? "text-accent" : ""}`}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
      <div className="hidden lg:block">
        <ButtonLink href="/demo" size="sm">Book a demo</ButtonLink>
      </div>

      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-stone lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div id="mobile-menu" hidden={!mobileOpen} className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-stone bg-paper px-5 py-6 lg:hidden">
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block py-3 text-(length:--step-2) font-medium">{item.label}</Link>
                {item.children?.length ? (
                  <ul className="mb-3 border-l border-stone pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}><Link href={c.href} onClick={close} className="block py-2 text-slate">{c.label}</Link></li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8">
          <ButtonLink href="/demo" full onClick={close}>Book a demo</ButtonLink>
        </div>
      </div>
    </>
  );
}
