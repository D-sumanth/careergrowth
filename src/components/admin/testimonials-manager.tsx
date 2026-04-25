"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploadField } from "@/components/admin/media-upload-field";

type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  content: string;
  imageUrl: string | null;
  rating: number | null;
};

const defaultForm = { name: "", role: "", content: "", imageUrl: "", rating: "5" };

export function TestimonialsManager({ items }: { items: TestimonialRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [form, setForm] = useState(
    items[0]
      ? { name: items[0].name, role: items[0].role, content: items[0].content, imageUrl: items[0].imageUrl ?? "", rating: String(items[0].rating ?? 5) }
      : defaultForm,
  );
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function select(item: TestimonialRecord | null) {
    setSelectedId(item?.id ?? null);
    setForm(item ? { name: item.name, role: item.role, content: item.content, imageUrl: item.imageUrl ?? "", rating: String(item.rating ?? 5) } : defaultForm);
    setStatus("");
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");
    const response = await fetch(selectedId ? `/api/admin/testimonials/${selectedId}` : "/api/admin/testimonials", {
      method: selectedId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        role: form.role,
        content: form.content,
        imageUrl: form.imageUrl,
        rating: form.rating ? Number(form.rating) : null,
      }),
    });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Saved.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save testimonial.");
    }
  }

  async function remove() {
    if (!selectedId) return;
    setPending(true);
    setStatus("");
    setError("");
    const response = await fetch(`/api/admin/testimonials/${selectedId}`, { method: "DELETE" });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Deleted.");
      select(null);
      router.refresh();
    } else {
      setError(result.message ?? "Unable to delete testimonial.");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] xl:grid-cols-[0.78fr_1.22fr]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-950">Testimonials</h2>
          <Button type="button" variant="secondary" onClick={() => select(null)}>
            Add testimonial
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
              <p className="font-medium">{item.name}</p>
              <p className={`mt-1 text-sm ${selectedId === item.id ? "text-slate-200" : "text-slate-600"}`}>{item.role || "General testimonial"}</p>
              {item.imageUrl ? <p className={`mt-1 text-xs ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>Profile image attached</p> : null}
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>{item.content}</p>
            </button>
          ))}
        </div>
      </Card>

      <form onSubmit={submit} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-950">{selected ? "Edit testimonial" : "Create testimonial"}</h2>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Role (optional)</span>
          <input value={form.role} onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Content</span>
          <textarea value={form.content} onChange={(e) => setForm((c) => ({ ...c, content: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
        </label>
        <MediaUploadField
          label="Profile image"
          value={form.imageUrl}
          onChange={(value) => setForm((c) => ({ ...c, imageUrl: value }))}
          helperText="Shown with the testimonial on the public site. Use a square or portrait-friendly image when possible."
        />
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Rating (optional)</span>
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((c) => ({ ...c, rating: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : selected ? "Update testimonial" : "Create testimonial"}</Button>
          {selected ? <Button type="button" variant="secondary" disabled={pending} onClick={remove}>Delete testimonial</Button> : null}
        </div>
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
