"use client";

import { useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { formatCurrency } from "@/lib/utils";

type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
  imageUrl: string | null;
  videoUrl: string | null;
  includedItems: string[];
  durationMinutes: number;
  pricePence: number;
  compareAtPricePence: number | null;
  isFeatured: boolean;
  isActive: boolean;
  bookingKind: string;
};

type ServiceFormState = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
  imageUrl: string;
  videoUrl: string;
  includedItemsText: string;
  durationMinutes: string;
  pricePence: string;
  compareAtPricePence: string;
  bookingKind: string;
  isActive: boolean;
  isFeatured: boolean;
};

const defaultForm: ServiceFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  whoItIsFor: "",
  imageUrl: "",
  videoUrl: "",
  includedItemsText: "",
  durationMinutes: "60",
  pricePence: "",
  compareAtPricePence: "",
  bookingKind: "ONE_TO_ONE",
  isActive: true,
  isFeatured: false,
};

function toFormState(service?: ServiceRecord): ServiceFormState {
  if (!service) return defaultForm;
  return {
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription,
    description: service.description,
    whoItIsFor: service.whoItIsFor,
    imageUrl: service.imageUrl ?? "",
    videoUrl: service.videoUrl ?? "",
    includedItemsText: service.includedItems.join("\n"),
    durationMinutes: String(service.durationMinutes),
    pricePence: String(service.pricePence),
    compareAtPricePence: service.compareAtPricePence ? String(service.compareAtPricePence) : "",
    bookingKind: service.bookingKind,
    isActive: service.isActive,
    isFeatured: service.isFeatured,
  };
}

export function ServicesManager({ items }: { items: ServiceRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [form, setForm] = useState<ServiceFormState>(toFormState(items[0]));
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function handleSelect(service: ServiceRecord | null) {
    setSelectedId(service?.id ?? null);
    setForm(toFormState(service ?? undefined));
    setStatus("");
    setError("");
  }

  function updateForm<K extends keyof ServiceFormState>(key: K, value: ServiceFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title, { lower: true, strict: true }),
      durationMinutes: Number(form.durationMinutes),
      pricePence: Number(form.pricePence),
      compareAtPricePence: form.compareAtPricePence ? Number(form.compareAtPricePence) : null,
    };

    const response = await fetch(selectedId ? `/api/admin/services/${selectedId}` : "/api/admin/services", {
      method: selectedId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setPending(false);

    if (response.ok) {
      setStatus(result.message ?? "Service saved.");
      if (!selectedId && result.item?.id) {
        setSelectedId(result.item.id);
      }
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save service.");
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    setPending(true);
    setStatus("");
    setError("");

    const response = await fetch(`/api/admin/services/${selectedId}`, { method: "DELETE" });
    const result = await response.json();
    setPending(false);

    if (response.ok) {
      setStatus(result.message ?? "Service deleted.");
      handleSelect(null);
      router.refresh();
    } else {
      setError(result.message ?? "Unable to delete service.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-950">Existing services</h2>
          <Button type="button" variant="secondary" onClick={() => handleSelect(null)}>
            Add service
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selectedId === item.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <p className="font-medium">{item.title}</p>
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-200" : "text-slate-600"}`}>
                {item.shortDescription}
              </p>
              {item.imageUrl ? <p className={`mt-2 text-xs ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>Image attached</p> : null}
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>
                {item.compareAtPricePence ? `${formatCurrency(item.compareAtPricePence)} -> ` : ""}
                {formatCurrency(item.pricePence)}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">{selectedId ? "Edit service" : "Create service"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Title</span>
            <input value={form.title} onChange={(e) => updateForm("title", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Slug</span>
            <input value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Short description</span>
            <input value={form.shortDescription} onChange={(e) => updateForm("shortDescription", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Description</span>
            <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Who it is for</span>
            <textarea value={form.whoItIsFor} onChange={(e) => updateForm("whoItIsFor", e.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <div className="md:col-span-2">
            <MediaUploadField
              label="Cover image"
              value={form.imageUrl}
              onChange={(value) => updateForm("imageUrl", value)}
              helperText="Upload a JPEG, PNG, or WebP image up to 5MB. This image appears at the top of the service card."
            />
          </div>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>YouTube video URL (optional)</span>
            <input value={form.videoUrl} onChange={(e) => updateForm("videoUrl", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="https://www.youtube.com/watch?v=..." />
            <p className="text-xs leading-6 text-slate-500">Shown on the service detail page in a responsive video section.</p>
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Included items (one per line)</span>
            <textarea value={form.includedItemsText} onChange={(e) => updateForm("includedItemsText", e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Duration (minutes)</span>
            <input type="number" min="0" value={form.durationMinutes} onChange={(e) => updateForm("durationMinutes", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Booking kind</span>
            <select value={form.bookingKind} onChange={(e) => updateForm("bookingKind", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
              <option value="ONE_TO_ONE">One to one</option>
              <option value="RESUME_REVIEW">Resume review</option>
              <option value="WORKSHOP">Workshop</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Active price (pence)</span>
            <input type="number" min="0" value={form.pricePence} onChange={(e) => updateForm("pricePence", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Original price (pence, optional)</span>
            <input type="number" min="0" value={form.compareAtPricePence} onChange={(e) => updateForm("compareAtPricePence", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => updateForm("isActive", e.target.checked)} />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm("isFeatured", e.target.checked)} />
            Featured
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : selectedId ? "Update service" : "Create service"}
          </Button>
          {selectedId ? (
            <Button type="button" variant="secondary" disabled={pending} onClick={handleDelete}>
              Delete service
            </Button>
          ) : null}
        </div>

        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
