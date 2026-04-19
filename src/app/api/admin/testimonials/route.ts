import { getSession } from "@/lib/auth/session";
import { createManagedTestimonial, getManagedTestimonials } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { testimonialAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await getManagedTestimonials();
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load testimonials.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, testimonialAdminSchema);
    const item = await createManagedTestimonial(payload);
    return jsonOk({ message: "Testimonial created.", item }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create testimonial.");
  }
}
