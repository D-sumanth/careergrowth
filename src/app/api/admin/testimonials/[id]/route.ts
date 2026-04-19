import { getSession } from "@/lib/auth/session";
import { deleteManagedTestimonial, updateManagedTestimonial } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { testimonialAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, testimonialAdminSchema);
    const { id } = await params;
    const item = await updateManagedTestimonial(id, payload);
    return jsonOk({ message: "Testimonial updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update testimonial.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteManagedTestimonial(id);
    return jsonOk({ message: "Testimonial deleted." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete testimonial.");
  }
}
