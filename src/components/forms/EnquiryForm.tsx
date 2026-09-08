"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONSENT_WORDING, ENQUIRY_TYPES, INDUSTRY_OPTIONS, enquirySchema, type EnquiryInput } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox, Field, Honeypot, Input, PrivacyNote, Select, Textarea } from "./fields";

type Props = {
  products: { slug: string; name: string }[];
  defaultType?: EnquiryInput["enquiryType"];
  defaultProduct?: string;
  defaultIndustry?: EnquiryInput["industry"];
  lockType?: boolean;
  /** Read ?enquiry=, ?product= and ?industry= from the URL to prefill. */
  readQuery?: boolean;
  submitLabel?: string;
};

const TYPES = new Set(["demo", "survey", "pricing", "general"]);
const INDUSTRIES = new Set(["care-homes", "hotels", "restaurants", "retail", "other"]);

export function EnquiryForm(props: Props) {
  if (!props.readQuery) return <Form {...props} />;
  return (
    <Suspense fallback={<Form {...props} />}>
      <FormWithQuery {...props} />
    </Suspense>
  );
}

function FormWithQuery(props: Props) {
  const sp = useSearchParams();
  const e = sp.get("enquiry");
  const i = sp.get("industry");
  const p = sp.get("product");
  return (
    <Form
      {...props}
      defaultType={e && TYPES.has(e) ? (e as EnquiryInput["enquiryType"]) : props.defaultType}
      defaultIndustry={i && INDUSTRIES.has(i) ? (i as EnquiryInput["industry"]) : props.defaultIndustry}
      defaultProduct={p && props.products.some((x) => x.slug === p) ? p : props.defaultProduct}
    />
  );
}

function Form({ products, defaultType = "general", defaultProduct = "", defaultIndustry, lockType, submitLabel = "Send enquiry" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { enquiryType: defaultType, product: defaultProduct, industry: defaultIndustry, marketingConsent: false },
  });

  async function onSubmit(data: EnquiryInput) {
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-[var(--radius)] border border-stone bg-mist p-6">
        <h3>Thanks. We have your enquiry.</h3>
        <p className="mt-2 text-slate">Someone from Carebot UK will reply within one working day. If it is about a demo, we will suggest a couple of times at Northfleet.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-6">
      <Honeypot register={() => register("website")} />
      {!lockType ? (
        <Field id="enquiryType" label="What is this about?" error={errors.enquiryType?.message}>
          <Select id="enquiryType" {...register("enquiryType")} error={errors.enquiryType?.message}>
            {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
      ) : (
        <input type="hidden" {...register("enquiryType")} />
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register("name")} error={errors.name?.message} />
        </Field>
        <Field id="email" label="Work email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        </Field>
        <Field id="company" label="Organisation" error={errors.company?.message}>
          <Input id="company" autoComplete="organization" {...register("company")} error={errors.company?.message} />
        </Field>
        <Field id="role" label="Your role" error={errors.role?.message}>
          <Input id="role" autoComplete="organization-title" placeholder="e.g. Registered manager" {...register("role")} error={errors.role?.message} />
        </Field>
        <Field id="industry" label="Sector" error={errors.industry?.message}>
          <Select id="industry" {...register("industry")} error={errors.industry?.message} defaultValue="">
            <option value="" disabled>Select</option>
            {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field id="product" label="Robot of interest" hint="Optional">
          <Select id="product" {...register("product")}>
            <option value="">Not sure yet</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </Select>
        </Field>
        <Field id="phone" label="Phone" hint="Optional, if you would rather we called" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
        </Field>
      </div>
      <Field id="message" label="Message" hint="Tell us about the building, the job you have in mind, or anything you want to ask." error={errors.message?.message}>
        <Textarea id="message" {...register("message")} error={errors.message?.message} />
      </Field>
      <ConsentCheckbox id="marketingConsent" wording={CONSENT_WORDING} {...register("marketingConsent")} />
      <PrivacyNote />
      {status === "error" ? <p role="alert" className="text-alert">Something went wrong sending that. Please try again, or email us directly.</p> : null}
      <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : submitLabel}</Button>
    </form>
  );
}
