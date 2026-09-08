import { z } from "zod";

export const INDUSTRY_OPTIONS = [
  { value: "care-homes", label: "Care home" },
  { value: "hotels", label: "Hotel" },
  { value: "restaurants", label: "Restaurant or hospitality" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
] as const;

export const ENQUIRY_TYPES = [
  { value: "demo", label: "Book a demo at Northfleet" },
  { value: "survey", label: "Request a site survey" },
  { value: "pricing", label: "Pricing and lease terms" },
  { value: "general", label: "General enquiry" },
] as const;

export const CONSENT_WORDING =
  "I would like to receive occasional emails from Carebot UK about service robots, deployments and events. I can unsubscribe at any time.";

export const enquirySchema = z.object({
  enquiryType: z.enum(["demo", "survey", "pricing", "general"]),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a work email address").max(200),
  company: z.string().trim().min(1, "Please enter your organisation").max(160),
  role: z.string().trim().min(1, "Please enter your role").max(120),
  industry: z.enum(["care-homes", "hotels", "restaurants", "retail", "other"]),
  product: z.string().trim().max(80).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
  marketingConsent: z.boolean(),
  website: z.string().max(0).optional(), // honeypot
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const resourceRequestSchema = z.object({
  resourceSlug: z.string().trim().min(1),
  firstName: z.string().trim().min(1, "Please enter your first name").max(80),
  lastName: z.string().trim().min(1, "Please enter your last name").max(80),
  email: z.string().trim().email("Please enter a work email address").max(200),
  company: z.string().trim().min(1, "Please enter your organisation").max(160),
  role: z.string().trim().min(1, "Please enter your role").max(120),
  industry: z.enum(["care-homes", "hotels", "restaurants", "retail", "other"]),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  marketingConsent: z.boolean(),
  website: z.string().max(0).optional(),
});
export type ResourceRequestInput = z.infer<typeof resourceRequestSchema>;
