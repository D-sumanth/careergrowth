import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";

const allowedDocumentMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

type UploadKind = "document" | "image";

function ensureUploadIsAllowed(file: File, kind: UploadKind) {
  if (kind === "image") {
    if (!allowedImageMimeTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are accepted.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Images must be smaller than 5MB.");
    }

    return;
  }

  if (!allowedDocumentMimeTypes.includes(file.type)) {
    throw new Error("Only PDF, DOC, DOCX, and TXT files are accepted.");
  }

  if (file.size > env.MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    throw new Error(`Files must be smaller than ${env.MAX_UPLOAD_SIZE_MB}MB.`);
  }
}

function createSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-");
}

function createPrivateObjectKey(fileName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `cv-uploads/anonymous/${year}/${month}/${randomUUID()}-${createSafeFileName(fileName)}`;
}

function createPublicObjectKey(fileName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `public-media/${year}/${month}/${randomUUID()}-${createSafeFileName(fileName)}`;
}

function getR2Client() {
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 credentials are missing. Add the R2 environment variables before using the R2 upload driver.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

async function storeUploadedFileLocally(file: File, fileKey: string, buffer: Buffer) {
  const outputPath = join(process.cwd(), "storage", "uploads", fileKey);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);
}

async function storeUploadedFileInR2(file: File, fileKey: string, buffer: Buffer) {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_PRIVATE,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
      },
    }),
  );
}

export async function storeUploadedFile(
  file: File,
  options?: {
    kind?: UploadKind;
    visibility?: "PRIVATE" | "SHARED" | "PUBLIC";
  },
) {
  const kind = options?.kind ?? "document";
  ensureUploadIsAllowed(file, kind);

  const buffer = Buffer.from(await file.arrayBuffer());
  const visibility = options?.visibility ?? "PRIVATE";
  const fileKey = visibility === "PUBLIC" ? createPublicObjectKey(file.name) : createPrivateObjectKey(file.name);

  if (env.UPLOAD_DRIVER === "r2") {
    await storeUploadedFileInR2(file, fileKey, buffer);
  } else {
    await storeUploadedFileLocally(file, fileKey, buffer);
  }

  return {
    storageKey: fileKey,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    kind,
    visibility,
    provider: env.UPLOAD_DRIVER,
    bucket: env.UPLOAD_DRIVER === "r2" ? env.R2_BUCKET_PRIVATE : "local",
  };
}

async function getUploadedFileBufferFromR2(storageKey: string) {
  const client = getR2Client();
  const result = await client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_PRIVATE,
      Key: storageKey,
    }),
  );

  if (!result.Body) {
    throw new Error("Stored file body is empty.");
  }

  return Buffer.from(await result.Body.transformToByteArray());
}

async function getUploadedFileBufferFromLocal(storageKey: string) {
  return readFile(join(process.cwd(), "storage", "uploads", storageKey));
}

export async function getStoredFileResponse(input: {
  storageKey: string;
  fileName: string;
  mimeType: string;
  inline?: boolean;
}) {
  const buffer =
    env.UPLOAD_DRIVER === "r2"
      ? await getUploadedFileBufferFromR2(input.storageKey)
      : await getUploadedFileBufferFromLocal(input.storageKey);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": input.mimeType || "application/octet-stream",
      "Content-Disposition": `${input.inline ? "inline" : "attachment"}; filename="${input.fileName.replace(/"/g, "")}"`,
      "Cache-Control": input.inline ? "public, max-age=3600, s-maxage=86400" : "private, no-store",
    },
  });
}
