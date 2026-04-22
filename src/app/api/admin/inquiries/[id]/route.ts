import { getSession } from "@/lib/auth/session";
import { updateManagedInquiry } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { inquiryAdminUpdateSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, inquiryAdminUpdateSchema);
    const { id } = await params;
    const item = await updateManagedInquiry(id, payload);
    return jsonOk({ message: "Inquiry updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update inquiry.");
  }
}
