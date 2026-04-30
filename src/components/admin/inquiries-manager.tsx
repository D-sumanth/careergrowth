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
  leadStage: string;
  tags: string[];
  assignedTo: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  internalNotes: string | null;
  followUpAt: Date | string | null;
  message: string;
};

const leadStages = [
  ["NEW_LEAD", "New lead"],
  ["QUALIFIED", "Qualified"],
  ["CONSULTATION_BOOKED", "Consultation booked"],
  ["PROPOSAL_SENT", "Proposal sent"],
  ["CONVERTED", "Converted"],
  ["NURTURE", "Nurture"],
  ["LOST", "Lost"],
] as const;

function formatStage(stage: string) {
  return leadStages.find(([value]) => value === stage)?.[1] ?? stage.replaceAll("_", " ").toLowerCase();
}

function parseTags(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ].slice(0, 12);
}

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
  const [leadStage, setLeadStage] = useState<Record<string, string>>({});
  const [tagText, setTagText] = useState<Record<string, string>>({});
  const [owner, setOwner] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [followUpAt, setFollowUpAt] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("ALL");

  const sources = [...new Set(items.map((item) => item.source?.trim()).filter(Boolean))];
  const categories = [...new Set(items.map((item) => item.category))];
  const tags = [...new Set(items.flatMap((item) => item.tags ?? []))].sort((a, b) => a.localeCompare(b));
  const filteredItems = items.filter((item) => {
    const matchesQuery =
      !query ||
      [item.name, item.email, item.subject, item.message]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesStage = stageFilter === "ALL" || item.leadStage === stageFilter;
    const matchesSource = sourceFilter === "ALL" || (item.source?.trim() || "unknown") === sourceFilter;
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchesTag = tagFilter === "ALL" || item.tags.includes(tagFilter);
    return matchesQuery && matchesStatus && matchesStage && matchesSource && matchesCategory && matchesTag;
  });

  async function save(item: InquiryRecord) {
    setPendingId(item.id);
    await fetch(`/api/admin/inquiries/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status[item.id] ?? item.status,
        leadStage: leadStage[item.id] ?? item.leadStage,
        tags: parseTags(tagText[item.id] ?? item.tags.join(", ")),
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
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Name, email, subject"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Status</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
            <option value="ALL">All statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESPONDED">Responded</option>
            <option value="CLOSED">Closed</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Lead stage</span>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
            <option value="ALL">All stages</option>
            {leadStages.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Source</span>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
            <option value="ALL">All sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
            <option value="unknown">unknown</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Category</span>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
            <option value="ALL">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Tag</span>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
            <option value="ALL">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredItems.map((item) => (
        <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-medium text-slate-950">{item.subject}</p>
              <p className="mt-1 text-sm text-slate-600">{item.name} - {item.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-white px-3 py-1">{item.category.replaceAll("_", " ")}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">{formatStage(item.leadStage)}</span>
                <span className="rounded-full bg-white px-3 py-1">{item.source ?? "unknown source"}</span>
                {item.medium ? <span className="rounded-full bg-white px-3 py-1">{item.medium}</span> : null}
                {item.campaign ? <span className="rounded-full bg-white px-3 py-1">Campaign: {item.campaign}</span> : null}
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1">
                    {tag}
                  </span>
                ))}
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="RESPONDED">Responded</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Lead stage</span>
                  <select
                    value={leadStage[item.id] ?? item.leadStage}
                    onChange={(e) => setLeadStage((current) => ({ ...current, [item.id]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  >
                    {leadStages.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Owner / follow-up</span>
                  <input
                    value={owner[item.id] ?? item.assignedTo ?? ""}
                    onChange={(e) => setOwner((current) => ({ ...current, [item.id]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    placeholder="Aditi"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Tags</span>
                  <input
                    value={tagText[item.id] ?? item.tags.join(", ")}
                    onChange={(e) => setTagText((current) => ({ ...current, [item.id]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    placeholder="hot lead, visa"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Follow-up reminder</span>
                <input
                  type="datetime-local"
                  value={followUpAt[item.id] ?? toDateTimeLocal(item.followUpAt)}
                  onChange={(e) => setFollowUpAt((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Internal notes</span>
                <textarea
                  value={notes[item.id] ?? item.internalNotes ?? ""}
                  onChange={(e) => setNotes((current) => ({ ...current, [item.id]: e.target.value }))}
                  className="min-h-24 w-full rounded-lg border border-slate-300 px-4 py-3"
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
      {!filteredItems.length ? <p className="text-sm text-slate-500">No inquiries match the current filters.</p> : null}
    </div>
  );
}
