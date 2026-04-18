"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type LeadFormProps = {
  endpoint: string;
  fields: Array<{ name: string; label: string; type?: string; required?: boolean; placeholder?: string }>;
  initialValues?: Record<string, string>;
  submitLabel: string;
};

export function LeadForm({ endpoint, fields, initialValues, submitLabel }: LeadFormProps) {
  const [status, setStatus] = useState<string>("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setPending(false);
    setStatus(result.message ?? (response.ok ? "Submitted successfully." : "Something went wrong."));
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {fields.map((field) => (
        <label key={field.name} className="block space-y-2 text-sm font-medium text-slate-700">
          <span>{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              defaultValue={initialValues?.[field.name]}
              placeholder={field.placeholder}
              className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              required={field.required}
              defaultValue={initialValues?.[field.name]}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            >
              <option value="">Select an option</option>
              <option value="GENERAL">General inquiry</option>
              <option value="RESUME_REVIEW">Resume review inquiry</option>
              <option value="CORPORATE_WORKSHOP">Corporate / university workshop inquiry</option>
              <option value="CONSULTATION">One-to-one consultation inquiry</option>
            </select>
          ) : (
            <input
              type={field.type ?? "text"}
              name={field.name}
              required={field.required}
              defaultValue={initialValues?.[field.name]}
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />
          )}
        </label>
      ))}
      {"consent" in (initialValues ?? {}) ? null : (
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" name="consent" value="true" className="mt-1" />
          <span>I consent to receiving the requested communication and understand I can unsubscribe from marketing emails later.</span>
        </label>
      )}
      <div className="flex items-center justify-between gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending..." : submitLabel}
        </Button>
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      </div>
    </form>
  );
}
