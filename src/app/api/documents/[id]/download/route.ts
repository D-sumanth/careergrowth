import { getSession } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { getAccessibleDocumentForUser } from "@/lib/reviews";
import { getStoredFileResponse } from "@/lib/storage/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return jsonError("Authentication required.", 401);
    }

    const { id } = await params;
    const document = await getAccessibleDocumentForUser({
      documentId: id,
      userId: session.userId,
      role: session.role,
    });

    return getStoredFileResponse({
      storageKey: document.storageKey,
      fileName: document.fileName,
      mimeType: document.mimeType,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to download document.";
    const status = message.includes("Authentication") ? 401 : message.includes("access") ? 403 : 400;
    return jsonError(message, status);
  }
}
