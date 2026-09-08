import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/forms";
import { consentRecord, notifyTeam, pushToHubSpot } from "@/lib/leads";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const consent = consentRecord(req, d.marketingConsent, req.headers.get("referer") ?? "/contact");
  const [firstName, ...rest] = d.name.split(" ");
  await Promise.all([
    pushToHubSpot(
      { email: d.email, firstName, lastName: rest.join(" "), company: d.company, role: d.role, industry: d.industry, phone: d.phone || undefined, message: d.message || undefined, leadSource: `enquiry:${d.enquiryType}` },
      consent,
    ),
    notifyTeam(`New ${d.enquiryType} enquiry from ${d.company}`, [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "-"}`,
      `Organisation: ${d.company}`,
      `Role: ${d.role}`,
      `Industry: ${d.industry}`,
      `Robot of interest: ${d.product || "-"}`,
      `Message: ${d.message || "-"}`,
      `Marketing consent: ${d.marketingConsent ? "yes" : "no"} (${consent.timestamp}, ${consent.ip}, form ${consent.formVersion})`,
    ]),
  ]);
  return NextResponse.json({ ok: true });
}
