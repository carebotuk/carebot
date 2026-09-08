import { NextResponse } from "next/server";
import { resourceRequestSchema } from "@/lib/forms";
import { getResource } from "@/lib/content";
import { consentRecord, notifyTeam, pushToHubSpot, sendAssetEmail } from "@/lib/leads";
import { absoluteUrl } from "@/lib/site";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = resourceRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });

  const resource = await getResource(d.resourceSlug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource" }, { status: 404 });

  const consent = consentRecord(req, d.marketingConsent, `/resources/${resource.slug}`);
  const tasks: Promise<unknown>[] = [
    pushToHubSpot(
      { email: d.email, firstName: d.firstName, lastName: d.lastName, company: d.company, role: d.role, industry: d.industry, phone: d.phone || undefined, leadSource: `resource:${resource.slug}` },
      consent,
    ),
    notifyTeam(`Resource request: ${resource.title}`, [
      `Name: ${d.firstName} ${d.lastName}`,
      `Email: ${d.email}`,
      `Organisation: ${d.company}`,
      `Role: ${d.role}`,
      `Industry: ${d.industry}`,
      `Phone: ${d.phone || "-"}`,
      `Asset: ${resource.asset ? "sent by email" : "not yet available — follow up manually"}`,
      `Marketing consent: ${d.marketingConsent ? "yes" : "no"} (${consent.timestamp}, ${consent.ip}, form ${consent.formVersion})`,
    ]),
  ];
  if (resource.asset) tasks.push(sendAssetEmail(d.email, d.firstName, resource.title, absoluteUrl(resource.asset)));
  await Promise.all(tasks);
  return NextResponse.json({ ok: true, delivered: Boolean(resource.asset) });
}
