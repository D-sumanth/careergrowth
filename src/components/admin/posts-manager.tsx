"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PostRecord = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
  content: string;
  published: boolean;
};

const defaultForm = { title: "", slug: "", topic: "Resources", excerpt: "", content: "", published: false };

export function PostsManager({ items }: { items: PostRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [form, setForm] = useState(
    items[0]
      ? { title: items[0].title, slug: items[0].slug, topic: items[0].topic, excerpt: items[0].excerpt, content: items[0].content, published: items[0].published }
      : defaultForm,
  );
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function select(item: PostRecord | null) {
    setSelectedId(item?.id ?? null);
    setForm(item ? { title: item.title, slug: item.slug, topic: item.topic, excerpt: item.excerpt, content: item.content, published: item.published } : defaultForm);
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
    };
    const response = await fetch(selectedId ? `/api/admin/posts/${selectedId}` : "/api/admin/posts", {
      method: selectedId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Saved.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save post.");
    }
  }

  async function remove() {
    if (!selectedId) return;
    setPending(true);
    setStatus("");
    setError("");
    const response = await fetch(`/api/admin/posts/${selectedId}`, { method: "DELETE" });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Deleted.");
      select(null);
      router.refresh();
    } else {
      setError(result.message ?? "Unable to delete post.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-950">Posts</h2>
          <Button type="button" variant="secondary" onClick={() => select(null)}>
            Add post
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
              <p className={`mt-1 text-sm ${selectedId === item.id ? "text-slate-200" : "text-slate-600"}`}>{item.topic}</p>
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-300" : "text-slate-500"}`}>{item.published ? "Published" : "Draft"}</p>
            </button>
          ))}
        </div>
      </Card>

      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">{selected ? "Edit post" : "Create post"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Title</span>
            <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Slug</span>
            <input value={form.slug} onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Topic</span>
            <input value={form.topic} onChange={(e) => setForm((c) => ({ ...c, topic: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Excerpt</span>
            <input value={form.excerpt} onChange={(e) => setForm((c) => ({ ...c, excerpt: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Content</span>
            <textarea value={form.content} onChange={(e) => setForm((c) => ({ ...c, content: e.target.value }))} className="min-h-64 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((c) => ({ ...c, published: e.target.checked }))} />
          Published
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : selected ? "Update post" : "Create post"}</Button>
          {selected ? <Button type="button" variant="secondary" disabled={pending} onClick={remove}>Delete post</Button> : null}
        </div>
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
