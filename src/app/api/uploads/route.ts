import { getSession } from "@/lib/auth/session";
import { listCurrentUserDocuments, saveUploadedDocumentForUser } from "@/lib/account";
import { jsonError, jsonOk } from "@/lib/http";
import { storeUploadedFile } from "@/lib/storage/uploads";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return jsonError("Authentication required.", 401);
  }

  const documents = await listCurrentUserDocuments(session.userId);
  return jsonOk({ documents });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return jsonError("Authentication required.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonError("No file provided.");
    }

    const purpose = formData.get("purpose");
    const isPublicMedia = purpose === "public-media";
    if (isPublicMedia && session.role !== "ADMIN") {
      return jsonError("Only admins can upload public media.", 403);
    }

    const stored = await storeUploadedFile(file, {
      kind: isPublicMedia ? "image" : "document",
      visibility: isPublicMedia ? "PUBLIC" : "PRIVATE",
    });
    const document = await saveUploadedDocumentForUser(session.userId, stored);
    const publicUrl = document.visibility === "PUBLIC" ? `/api/media/${document.id}` : null;
    return jsonOk({ message: "File uploaded successfully.", file: { ...stored, publicUrl }, document }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to upload file.");
  }
}
