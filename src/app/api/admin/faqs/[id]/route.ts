import { getSession } from "@/lib/auth/session";
import { deleteManagedFaq, updateManagedFaq } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { faqAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, faqAdminSchema);
    const { id } = await params;
    const item = await updateManagedFaq(id, payload);
    return jsonOk({ message: "FAQ updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update FAQ.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteManagedFaq(id);
    return jsonOk({ message: "FAQ deleted." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete FAQ.");
  }
}
