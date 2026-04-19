"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type FaqRecord = {
  id: string;
  question: string;
  answer: string;
};

const defaultForm = { question: "", answer: "" };

export function FaqsManager({ items }: { items: FaqRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [form, setForm] = useState(items[0] ? { question: items[0].question, answer: items[0].answer } : defaultForm);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function select(item: FaqRecord | null) {
    setSelectedId(item?.id ?? null);
    setForm(item ? { question: item.question, answer: item.answer } : defaultForm);
    setStatus("");
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");
    const response = await fetch(selectedId ? `/api/admin/faqs/${selectedId}` : "/api/admin/faqs", {
      method: selectedId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Saved.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save FAQ.");
    }
  }

  async function remove() {
    if (!selectedId) return;
    setPending(true);
    setStatus("");
    setError("");
    const response = await fetch(`/api/admin/faqs/${selectedId}`, { method: "DELETE" });
    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Deleted.");
      select(null);
      router.refresh();
    } else {
      setError(result.message ?? "Unable to delete FAQ.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-950">FAQs</h2>
          <Button type="button" variant="secondary" onClick={() => select(null)}>
            Add FAQ
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
              <p className="font-medium">{item.question}</p>
              <p className={`mt-2 text-sm ${selectedId === item.id ? "text-slate-200" : "text-slate-600"}`}>{item.answer}</p>
            </button>
          ))}
        </div>
      </Card>

      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">{selected ? "Edit FAQ" : "Create FAQ"}</h2>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Question</span>
          <input value={form.question} onChange={(e) => setForm((c) => ({ ...c, question: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3" required />
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Answer</span>
          <textarea value={form.answer} onChange={(e) => setForm((c) => ({ ...c, answer: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" required />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : selected ? "Update FAQ" : "Create FAQ"}</Button>
          {selected ? <Button type="button" variant="secondary" disabled={pending} onClick={remove}>Delete FAQ</Button> : null}
        </div>
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
