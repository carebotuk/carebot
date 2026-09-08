"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

const KEY = "cb-consent-v1";
const EVENT = "cb:consent-change";
type Consent = { analytics: boolean; at: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function applyConsent(c: Consent) {
  gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function parse(raw: string): Consent | null {
  try {
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/**
 * Consent-mode v2 banner. Analytics stays denied until the visitor accepts.
 * Reject-all is a real option, equal in weight to accept.
 */
export function CookieBanner() {
  // "pending" on the server and first client render, so there is no hydration mismatch.
  const raw = useSyncExternalStore(subscribe, readRaw, () => "pending");
  const consent = raw === "pending" ? undefined : parse(raw);
  const [forcedOpen, setForcedOpen] = useState(false);

  useEffect(() => {
    if (consent) applyConsent(consent);
  }, [consent]);

  useEffect(() => {
    const onOpen = () => setForcedOpen(true);
    window.addEventListener("cb:open-cookie-settings", onOpen);
    return () => window.removeEventListener("cb:open-cookie-settings", onOpen);
  }, []);

  function decide(analytics: boolean) {
    const c: Consent = { analytics, at: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    setForcedOpen(false);
  }

  const visible = raw !== "pending" && (forcedOpen || !consent);
  if (!visible) return null;
  return (
    <div role="dialog" aria-labelledby="cookie-heading" aria-describedby="cookie-desc" className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl rounded-[var(--radius)] border border-stone bg-paper p-5 shadow-[0_20px_60px_-20px_rgba(28,27,25,0.35)] sm:p-6">
      <h2 id="cookie-heading" className="text-(length:--step-1) font-medium">Cookies</h2>
      <p id="cookie-desc" className="mt-2 text-(length:--step--1) text-slate">
        We use one optional analytics cookie (Google Analytics) to see which pages are useful. Nothing is set until you choose. Read our <Link href="/cookies" className="underline underline-offset-4">cookie policy</Link>.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button size="sm" onClick={() => decide(true)}>Accept analytics</Button>
        <Button size="sm" variant="secondary" onClick={() => decide(false)}>Reject all</Button>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`underline underline-offset-4 ${className}`} onClick={() => window.dispatchEvent(new Event("cb:open-cookie-settings"))}>
      Change cookie settings
    </button>
  );
}
