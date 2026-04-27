"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type InquiryRecord = {
  id: string;
  subject: string;
  name: string;
  email: string;
  category: string;
  status: string;
  assignedTo: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  internalNotes: string | null;
  followUpAt: Date | string | null;
  message: string;
};

function toDateTimeLocal(value: Date | string | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function InquiriesManager({ items }: { items: InquiryRecord[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [owner, setOwner] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [followUpAt, setFollowUpAt] = useState<Record<string, string>>({});

  async function save(item: InquiryRecord) {
    setPendingId(item.id);
    await fetch(`/api/admin/inquiries/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status[item.id] ?? item.status,
        assignedTo: owner[item.id] ?? item.assignedTo ?? "",
        internalNotes: notes[item.id] ?? item.internalNotes ?? "",
        followUpAt: followUpAt[item.id] ?? toDateTimeLocal(item.followUpAt),
      }),
    });
    setPendingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-medium text-slate-950">{item.subject}</p>
              <p className="mt-1 text-sm text-slate-600">{item.name} - {item.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-white px-3 py-1">{item.category.replaceAll("_", " ")}</span>
                <span className="rounded-full bg-white px-3 py-1">{item.source ?? "unknown source"}</span>
                {item.medium ? <span className="rounded-full bg-white px-3 py-1">{item.medium}</span> : null}
                {item.campaign ? <span className="rounded-full bg-white px-3 py-1">Campaign: {item.campaign}</span> : null}
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.message}</p>
            </div>
            <div className="grid gap-3 lg:w-[460px]">
              <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Status</span>
                <select
                  value={status[item.id] ?? item.status}
                  onChange={(e) => setStatus((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESPONDED">Responded</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Owner / follow-up</span>
                <input
                  value={owner[item.id] ?? item.assignedTo ?? ""}
                  onChange={(e) => setOwner((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Aditi"
                />
              </label>
              </div>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Follow-up reminder</span>
                <input
                  type="datetime-local"
                  value={followUpAt[item.id] ?? toDateTimeLocal(item.followUpAt)}
                  onChange={(e) => setFollowUpAt((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Internal notes</span>
                <textarea
                  value={notes[item.id] ?? item.internalNotes ?? ""}
                  onChange={(e) => setNotes((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Call outcome, follow-up plan, or lead notes"
                />
              </label>
              <div>
                <Button type="button" disabled={pendingId === item.id} onClick={() => save(item)}>
                  {pendingId === item.id ? "Saving..." : "Update inquiry"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
