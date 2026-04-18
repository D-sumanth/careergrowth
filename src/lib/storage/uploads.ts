import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export function ensureUploadIsAllowed(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Only PDF, DOC, DOCX, and TXT files are accepted.");
  }

  if (file.size > env.MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    throw new Error(`Files must be smaller than ${env.MAX_UPLOAD_SIZE_MB}MB.`);
  }
}

export async function storeUploadedFile(file: File) {
  ensureUploadIsAllowed(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileKey = `${Date.now()}-${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const outputDir =
    env.UPLOAD_DRIVER === "local"
      ? join(process.cwd(), "storage", "uploads")
      : join(process.cwd(), "storage", "uploads");
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, fileKey), buffer);

  return {
    storageKey: fileKey,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}
