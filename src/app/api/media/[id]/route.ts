import { getPublicMediaDocument } from "@/lib/account";
import { getStoredFileResponse } from "@/lib/storage/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await getPublicMediaDocument(id);
  if (!document) {
    return new Response("Not found", { status: 404 });
  }

  return getStoredFileResponse({
    storageKey: document.storageKey,
    fileName: document.fileName,
    mimeType: document.mimeType,
    inline: true,
  });
}
