"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONSENT_WORDING, INDUSTRY_OPTIONS, resourceRequestSchema, type ResourceRequestInput } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox, Field, Honeypot, Input, PrivacyNote, Select } from "./fields";

type Props = { resourceSlug: string; heading: string; available: boolean; defaultIndustry?: ResourceRequestInput["industry"] };

export function ResourceRequestForm({ resourceSlug, heading, available, defaultIndustry }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<ResourceRequestInput>({
    resolver: zodResolver(resourceRequestSchema),
    defaultValues: { resourceSlug, industry: defaultIndustry, marketingConsent: false },
  });

  async function onSubmit(data: ResourceRequestInput) {
    setStatus("sending");
    try {
      const res = await fetch("/api/resource-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-[var(--radius)] border border-stone bg-paper p-6">
        <h3>{available ? "Check your inbox." : "You are on the list."}</h3>
        <p className="mt-2 text-slate">
          {available
            ? "We have emailed you a link to the document. If it has not arrived in a few minutes, check your junk folder."
            : "This document is being finalised. We will email it to you the day it is published."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5 rounded-[var(--radius)] border border-stone bg-paper p-6 sm:p-8">
      <Honeypot register={() => register("website")} />
      <input type="hidden" {...register("resourceSlug")} />
      <h2 className="text-(length:--step-2)">{heading}</h2>
      {!available ? <p className="text-(length:--step--1) text-slate">Being finalised. Leave your details and we will send it the day it is published.</p> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" {...register("firstName")} error={errors.firstName?.message} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" {...register("lastName")} error={errors.lastName?.message} />
        </Field>
      </div>
      <Field id="r-email" label="Work email" hint="We send the document as a link to this address." error={errors.email?.message}>
        <Input id="r-email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="r-company" label="Organisation" error={errors.company?.message}>
          <Input id="r-company" autoComplete="organization" {...register("company")} error={errors.company?.message} />
        </Field>
        <Field id="r-role" label="Your role" error={errors.role?.message}>
          <Input id="r-role" autoComplete="organization-title" {...register("role")} error={errors.role?.message} />
        </Field>
        <Field id="r-industry" label="Sector" error={errors.industry?.message}>
          <Select id="r-industry" {...register("industry")} error={errors.industry?.message} defaultValue={defaultIndustry ?? ""}>
            <option value="" disabled>Select</option>
            {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field id="r-phone" label="Phone" hint="Optional" error={errors.phone?.message}>
          <Input id="r-phone" type="tel" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
        </Field>
      </div>
      <ConsentCheckbox id="r-consent" wording={CONSENT_WORDING} {...register("marketingConsent")} />
      <PrivacyNote />
      {status === "error" ? <p role="alert" className="text-alert">Something went wrong. Please try again.</p> : null}
      <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : available ? "Email me the document" : "Notify me when published"}</Button>
    </form>
  );
}
