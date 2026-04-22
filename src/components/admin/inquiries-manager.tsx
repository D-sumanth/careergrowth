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
  message: string;
};

export function InquiriesManager({ items }: { items: InquiryRecord[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [owner, setOwner] = useState<Record<string, string>>({});

  async function save(item: InquiryRecord) {
    setPendingId(item.id);
    await fetch(`/api/admin/inquiries/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status[item.id] ?? item.status,
        assignedTo: owner[item.id] ?? item.assignedTo ?? "",
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
              <p className="mt-2 text-sm text-slate-600">{item.message}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
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
              <div className="sm:col-span-2">
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
