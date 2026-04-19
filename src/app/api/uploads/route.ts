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

    const stored = await storeUploadedFile(file);
    const document = await saveUploadedDocumentForUser(session.userId, stored);
    return jsonOk({ message: "File uploaded successfully.", file: stored, document }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to upload file.");
  }
}
