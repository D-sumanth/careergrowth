"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ReviewDocument = {
  id: string;
  fileName: string;
  visibility: string;
  createdAt: string | Date;
};

type ReviewRecord = {
  id: string;
  jobTarget: string;
  currentChallenge: string;
  status: string;
  assignedToId: string | null;
  notes: string | null;
  deliverySummary: string | null;
  turnaroundHours: number | null;
  requesterName: string;
  documents: ReviewDocument[];
};

type Assignee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function ReviewsManager({ items, assignees }: { items: ReviewRecord[]; assignees: Assignee[] }) {
  const router = useRouter();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: string; assignedToId: string; notes: string; deliverySummary: string; turnaroundHours: string }>>({});

  function getDraft(item: ReviewRecord) {
    return drafts[item.id] ?? {
      status: item.status,
      assignedToId: item.assignedToId ?? "",
      notes: item.notes ?? "",
      deliverySummary: item.deliverySummary ?? "",
      turnaroundHours: item.turnaroundHours ? String(item.turnaroundHours) : "",
    };
  }

  function updateDraft(itemId: string, key: "status" | "assignedToId" | "notes" | "deliverySummary" | "turnaroundHours", value: string) {
    setDrafts((current) => ({
      ...current,
      [itemId]: {
        ...(current[itemId] ?? { status: "NEW", assignedToId: "", notes: "", deliverySummary: "", turnaroundHours: "" }),
        [key]: value,
      },
    }));
  }

  async function save(item: ReviewRecord) {
    const draft = getDraft(item);
    setPendingId(item.id);
    await fetch(`/api/admin/reviews/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: draft.status,
        assignedToId: draft.assignedToId,
        notes: draft.notes,
        deliverySummary: draft.deliverySummary,
        turnaroundHours: draft.turnaroundHours ? Number(draft.turnaroundHours) : null,
      }),
    });
    setPendingId(null);
    router.refresh();
  }

  async function uploadDelivery(itemId: string) {
    const fileInput = fileInputRefs.current[itemId];
    const file = fileInput?.files?.[0];
    if (!file) {
      return;
    }

    setUploadingId(itemId);
    const formData = new FormData();
    formData.set("file", file);

    await fetch(`/api/admin/reviews/${itemId}/delivery`, {
      method: "POST",
      body: formData,
    });

    if (fileInput) {
      fileInput.value = "";
    }
    setUploadingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const draft = getDraft(item);
        const deliveredFiles = item.documents.filter((document) => document.visibility === "SHARED");
        const submittedFiles = item.documents.filter((document) => document.visibility !== "SHARED");

        return (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-950">{item.jobTarget}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.requesterName}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.currentChallenge}</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Submitted files</p>
                  <div className="mt-3 space-y-2">
                    {submittedFiles.length ? (
                      submittedFiles.map((document) => (
                        <a key={document.id} href={`/api/documents/${document.id}/download`} className="block text-sm text-slate-700 underline underline-offset-4">
                          {document.fileName}
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No client files attached yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Delivered files</p>
                  <div className="mt-3 space-y-2">
                    {deliveredFiles.length ? (
                      deliveredFiles.map((document) => (
                        <a key={document.id} href={`/api/documents/${document.id}/download`} className="block text-sm text-slate-700 underline underline-offset-4">
                          {document.fileName}
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nothing delivered yet.</p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      ref={(node) => {
                        fileInputRefs.current[item.id] = node;
                      }}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                    />
                    <Button type="button" disabled={uploadingId === item.id} onClick={() => uploadDelivery(item.id)}>
                      {uploadingId === item.id ? "Uploading..." : "Upload delivery"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Status</span>
                  <select value={draft.status} onChange={(e) => updateDraft(item.id, "status", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="AWAITING_CLIENT">Awaiting client</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Assigned to</span>
                  <select value={draft.assignedToId} onChange={(e) => updateDraft(item.id, "assignedToId", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
                    <option value="">Unassigned</option>
                    {assignees.map((assignee) => (
                      <option key={assignee.id} value={assignee.id}>
                        {assignee.name} ({assignee.role})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                  <span>Internal notes</span>
                  <textarea value={draft.notes} onChange={(e) => updateDraft(item.id, "notes", e.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                  <span>Delivery summary</span>
                  <textarea value={draft.deliverySummary} onChange={(e) => updateDraft(item.id, "deliverySummary", e.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Turnaround hours</span>
                  <input type="number" min="0" value={draft.turnaroundHours} onChange={(e) => updateDraft(item.id, "turnaroundHours", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
                </label>
                <div className="flex items-end">
                  <Button type="button" disabled={pendingId === item.id} onClick={() => save(item)}>
                    {pendingId === item.id ? "Saving..." : "Update review"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
