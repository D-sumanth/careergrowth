import { getSession } from "@/lib/auth/session";
import { deleteManagedWorkshop, updateManagedWorkshop } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { workshopAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, workshopAdminSchema);
    const { id } = await params;
    const item = await updateManagedWorkshop(id, payload);
    return jsonOk({ message: "Workshop updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update workshop.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteManagedWorkshop(id);
    return jsonOk({ message: "Workshop deleted." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete workshop.");
  }
}
