"use client";

import { useMemo, useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { formatCurrency } from "@/lib/utils";

type WorkshopRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startsAt: Date | string;
  endsAt: Date | string;
  timezone: string;
  seatLimit: number;
  soldCount: number;
  waitlistEnabled: boolean;
  pricePence: number;
  compareAtPricePence: number | null;
  status: string;
  replayUrl: string | null;
  downloadUrl: string | null;
};

type WorkshopFormState = {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  seatLimit: string;
  waitlistEnabled: boolean;
  pricePence: string;
  compareAtPricePence: string;
  status: string;
  replayUrl: string;
  downloadUrl: string;
};

const defaultForm: WorkshopFormState = {
  title: "",
  slug: "",
  description: "",
  imageUrl: "",
  startsAt: "",
  endsAt: "",
  timezone: "Europe/London",
  seatLimit: "40",
  waitlistEnabled: true,
  pricePence: "",
  compareAtPricePence: "",
  status: "DRAFT",
  replayUrl: "",
  downloadUrl: "",
};

function toDateTimeLocal(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toFormState(item?: WorkshopRecord): WorkshopFormState {
  if (!item) return defaultForm;
  return {
    title: item.title,
    slug: item.slug,
    description: item.description,
    imageUrl: item.imageUrl ?? "",
    startsAt: toDateTimeLocal(item.startsAt),
    endsAt: toDateTimeLocal(item.endsAt),
    timezone: item.timezone,
    seatLimit: String(item.seatLimit),
    waitlistEnabled: item.waitlistEnabled,
    pricePence: String(item.pricePence),
    compareAtPricePence: item.compareAtPricePence ? String(item.compareAtPricePence) : "",
    status: item.status,
    replayUrl: item.replayUrl ?? "",
    downloadUrl: item.downloadUrl ?? "",
  };
}

export function WorkshopsManager({ items }: { items: WorkshopRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [form, setForm] = useState<WorkshopFormState>(toFormState(items[0]));
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function select(item: WorkshopRecord | null) {
    setSelectedId(item?.id ?? null);
    setForm(toFormState(item ?? undefined));
    setStatus("");
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title, { lower: true, strict: true }),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      seatLimit: Number(form.seatLimit),
      pricePence: Number(form.pricePence),
      compareAtPricePence: form.compareAtPricePence ? Number(form.compareAtPricePence) : null,
    };

    const response = await fetch(selectedId ? `/api/admin/workshops/${selectedId}` : "/api/admin/workshops", {
      method: selectedId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setPending(false);

    if (response.ok) {
      setStatus(result.message ?? "Workshop saved.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save workshop.");
    }
  }

  async function remove() {
    if (!selectedId) return;
    setPending(true);
    setStatus("");
    setError("");

    const response = await fetch(`/api/admin/workshops/${selectedId}`, { method: "DELETE" });
    const result = await response.json();
    setPending(false);

    if (response.ok) {
      setStatus(result.message ?? "Workshop deleted.");
      select(null);
      router.refresh();
    } else {
      setError(result.message ?? "Unable to delete workshop.");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] xl:grid-cols-[0.78fr_1.22fr]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-950">Existing workshops</h2>
          <Button type="button" variant="secondary" onClick={() => select(null)}>
            Add workshop
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selectedId === item.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="font-medium">{item.title}</p>
              <p className={`mt-1 text-sm ${selectedId === item.id ? "text-slate-200" : "text-slate-600"}`}>{item.status}</p>
              {item.imageUrl ? <p className={`mt-1 text-xs ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>Image attached</p> : null}
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>
                {item.compareAtPricePence ? `${formatCurrency(item.compareAtPricePence)} -> ` : ""}
                {formatCurrency(item.pricePence)}
              </p>
              <p className={`mt-1 text-xs ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>
                {item.soldCount}/{item.seatLimit} seats
              </p>
            </button>
          ))}
        </div>
      </Card>

      <form onSubmit={submit} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-950">{selected ? "Edit workshop" : "Create workshop"}</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Title</span>
            <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Slug</span>
            <input value={form.slug} onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700 lg:col-span-2">
            <span>Description</span>
            <textarea value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <div className="lg:col-span-2">
            <MediaUploadField
              label="Workshop cover image"
              value={form.imageUrl}
              onChange={(value) => setForm((c) => ({ ...c, imageUrl: value }))}
              helperText="This image appears at the top of the workshop card and detail sections."
            />
          </div>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Starts at</span>
            <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((c) => ({ ...c, startsAt: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Ends at</span>
            <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((c) => ({ ...c, endsAt: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Timezone</span>
            <input value={form.timezone} onChange={(e) => setForm((c) => ({ ...c, timezone: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Seat limit</span>
            <input type="number" min="1" value={form.seatLimit} onChange={(e) => setForm((c) => ({ ...c, seatLimit: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Active price (pence)</span>
            <input type="number" min="0" value={form.pricePence} onChange={(e) => setForm((c) => ({ ...c, pricePence: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Original price (pence)</span>
            <input type="number" min="0" value={form.compareAtPricePence} onChange={(e) => setForm((c) => ({ ...c, compareAtPricePence: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Status</span>
            <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700 lg:col-span-2">
            <span>Replay URL</span>
            <input value={form.replayUrl} onChange={(e) => setForm((c) => ({ ...c, replayUrl: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 lg:col-span-2">
            <span>Download URL</span>
            <input value={form.downloadUrl} onChange={(e) => setForm((c) => ({ ...c, downloadUrl: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.waitlistEnabled} onChange={(e) => setForm((c) => ({ ...c, waitlistEnabled: e.target.checked }))} />
          Enable waitlist
        </label>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : selected ? "Update workshop" : "Create workshop"}</Button>
          {selected ? <Button type="button" variant="secondary" disabled={pending} onClick={remove}>Delete workshop</Button> : null}
        </div>
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
