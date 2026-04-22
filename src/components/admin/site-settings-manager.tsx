"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SiteSettingsForm = {
  name: string;
  consultantName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  linkedin: string;
  instagram: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  mission: string;
  credibility: string;
  contactNote: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  valuesText: string;
  workshopsTitle: string;
  workshopsDescription: string;
  footerDescription: string;
};

export function SiteSettingsManager({ initialValues }: { initialValues: SiteSettingsForm }) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");

    const response = await fetch("/api/admin/site-settings/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setPending(false);

    if (response.ok) {
      setStatus(result.message ?? "Site settings updated.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to update site settings.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-950">Brand, homepage, about, and contact copy</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["name", "Site name"],
          ["consultantName", "Consultant name"],
          ["tagline", "Tagline"],
          ["email", "Contact email"],
          ["phone", "Phone / booking note"],
          ["whatsapp", "WhatsApp link"],
          ["location", "Location"],
          ["linkedin", "LinkedIn URL"],
          ["instagram", "Instagram URL"],
          ["heroBadge", "Hero badge"],
          ["heroTitle", "Hero title"],
          ["heroDescription", "Hero description"],
          ["mission", "Mission"],
          ["credibility", "Credibility blurb"],
          ["contactNote", "Contact note"],
          ["aboutTitle", "About title"],
          ["aboutIntro", "About intro"],
          ["aboutBody", "About body"],
          ["workshopsTitle", "Workshops page title"],
          ["workshopsDescription", "Workshops page description"],
          ["footerDescription", "Footer description"],
        ].map(([key, label]) => (
          <label key={key} className={`space-y-2 text-sm text-slate-700 ${["heroTitle", "heroDescription", "mission", "credibility", "contactNote", "aboutTitle", "aboutIntro", "aboutBody", "workshopsTitle", "workshopsDescription", "footerDescription"].includes(key) ? "md:col-span-2" : ""}`}>
            <span>{label}</span>
            {["heroTitle", "heroDescription", "mission", "credibility", "contactNote", "aboutIntro", "aboutBody", "workshopsTitle", "workshopsDescription", "footerDescription"].includes(key) ? (
              <textarea value={form[key as keyof SiteSettingsForm]} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
            ) : (
              <input value={form[key as keyof SiteSettingsForm]} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required={!["whatsapp", "instagram"].includes(key)} />
            )}
          </label>
        ))}
        <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
          <span>Mission and values (one per line)</span>
          <textarea value={form.valuesText} onChange={(e) => setForm((current) => ({ ...current, valuesText: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save site content"}</Button>
      </div>
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
