"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function DocumentUploadPanel() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setPending(false);
    if (response.ok) {
      setStatus(result.message ?? "Done.");
      formRef.current?.reset();
      router.refresh();
    } else {
      setError(result.message ?? "Unable to upload file.");
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-950">Upload a document</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Accepted formats: PDF, DOC, DOCX, and TXT up to 10MB.</p>
      </div>
      <input
        type="file"
        name="file"
        required
        accept=".pdf,.doc,.docx,.txt"
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
      />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading..." : "Upload CV / document"}
        </Button>
      </div>
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
