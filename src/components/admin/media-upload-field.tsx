"use client";

import { useId, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
};

export function MediaUploadField({ label, value, onChange, helperText }: MediaUploadFieldProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "public-media");

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message ?? "Unable to upload image.");
      } else {
        onChange(result.file?.publicUrl ?? "");
      }
    } catch {
      setError("Unable to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 text-sm text-slate-700">
        <span>{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="/api/media/... or https://..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload image"}
        </label>
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} disabled={uploading} />
        {value ? (
          <Button type="button" variant="secondary" onClick={() => onChange("")}>
            <X className="mr-2 h-4 w-4" />
            Remove image
          </Button>
        ) : null}
      </div>

      {helperText ? <p className="text-xs leading-6 text-slate-500">{helperText}</p> : null}

      {value ? (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
          <div className="aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
