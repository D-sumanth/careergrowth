import { getSession } from "@/lib/auth/session";
import { updateManagedReview } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { reviewAdminUpdateSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, reviewAdminUpdateSchema);
    const { id } = await params;
    const item = await updateManagedReview(id, payload);
    return jsonOk({ message: "Review updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update review.");
  }
}
