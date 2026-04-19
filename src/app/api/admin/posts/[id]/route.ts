import { getSession } from "@/lib/auth/session";
import { deleteManagedPost, updateManagedPost } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { postAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, postAdminSchema);
    const { id } = await params;
    const item = await updateManagedPost(id, payload);
    return jsonOk({ message: "Post updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update post.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteManagedPost(id);
    return jsonOk({ message: "Post deleted." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete post.");
  }
}
