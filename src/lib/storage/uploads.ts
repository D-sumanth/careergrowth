import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

function createSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-");
}

function createPrivateObjectKey(fileName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `cv-uploads/anonymous/${year}/${month}/${randomUUID()}-${createSafeFileName(fileName)}`;
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
  const outputDir = join(process.cwd(), "storage", "uploads");
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, fileKey), buffer);
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

export async function storeUploadedFile(file: File) {
  ensureUploadIsAllowed(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileKey = createPrivateObjectKey(file.name);

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
    provider: env.UPLOAD_DRIVER,
    bucket: env.UPLOAD_DRIVER === "r2" ? env.R2_BUCKET_PRIVATE : "local",
  };
}
