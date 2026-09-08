import "server-only";
import { Resend } from "resend";
import { site } from "./site";
import { CONSENT_WORDING } from "./forms";

/**
 * Lead plumbing — Section 10 of the brief.
 * Everything is behind env vars. With none set, submissions are logged and
 * accepted so the site never 500s on a form; with them set, leads go to
 * HubSpot, a notification goes by email, and gated assets are emailed as a link.
 *
 *   RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_NOTIFY_EMAIL
 *   HUBSPOT_ACCESS_TOKEN (private app, crm.objects.contacts write)
 *   SLACK_WEBHOOK_URL (optional)
 */

export type ConsentRecord = {
  marketingConsent: boolean;
  consentWording: string;
  formVersion: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  page: string;
};

export function consentRecord(req: Request, marketingConsent: boolean, page: string): ConsentRecord {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return {
    marketingConsent,
    consentWording: CONSENT_WORDING,
    formVersion: site.formVersion,
    timestamp: new Date().toISOString(),
    ip: fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
    page,
  };
}

type Contact = {
  email: string;
  firstName: string;
  lastName?: string;
  company: string;
  role: string;
  industry: string;
  phone?: string;
  message?: string;
  leadSource: string;
};

export async function pushToHubSpot(c: Contact, consent: ConsentRecord): Promise<void> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return;
  const properties: Record<string, string> = {
    email: c.email,
    firstname: c.firstName,
    lastname: c.lastName ?? "",
    company: c.company,
    jobtitle: c.role,
    phone: c.phone ?? "",
    hs_lead_status: "NEW",
    lifecyclestage: "lead",
    // Custom properties — create these in HubSpot: industry_sector, lead_source_detail, marketing_consent, consent_record
    industry_sector: c.industry,
    lead_source_detail: c.leadSource,
    marketing_consent: consent.marketingConsent ? "true" : "false",
    consent_record: JSON.stringify(consent),
    message: c.message ?? "",
  };
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
  });
  if (res.status === 409) {
    // Existing contact: update by email instead.
    const upd = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(c.email)}?idProperty=email`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
    });
    if (!upd.ok) console.error("hubspot update failed", upd.status, await upd.text());
    return;
  }
  if (!res.ok) console.error("hubspot create failed", res.status, await res.text());
}

function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function notifyTeam(subject: string, lines: string[]): Promise<void> {
  const text = lines.join("\n");
  const r = resend();
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (r && to && from) {
    const { error } = await r.emails.send({ from, to, subject, text });
    if (error) console.error("resend notify failed", error);
  } else {
    console.log(`[lead] ${subject}\n${text}`);
  }
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (hook) {
    await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `*${subject}*\n${text}` }) }).catch((e) => console.error("slack failed", e));
  }
}

export async function sendAssetEmail(to: string, firstName: string, title: string, assetUrl: string): Promise<boolean> {
  const r = resend();
  const from = process.env.LEAD_FROM_EMAIL;
  if (!r || !from) {
    console.log(`[asset] would email ${to}: ${title} -> ${assetUrl}`);
    return false;
  }
  const { error } = await r.emails.send({
    from,
    to,
    subject: `Your copy of "${title}" from Carebot UK`,
    text: [
      `Hello ${firstName},`,
      "",
      `Thanks for requesting "${title}". Here is your link:`,
      assetUrl,
      "",
      "If you would like to see a robot working, our demonstration facility in Northfleet, Kent is open by appointment: " + site.domain + "/demo",
      "",
      "Carebot UK",
      site.legalName,
    ].join("\n"),
  });
  if (error) {
    console.error("resend asset failed", error);
    return false;
  }
  return true;
}
