import { getSession } from "@/lib/auth/session";
import { createManagedFaq, getManagedFaqs } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { faqAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await getManagedFaqs();
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load FAQs.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, faqAdminSchema);
    const item = await createManagedFaq(payload);
    return jsonOk({ message: "FAQ created.", item }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create FAQ.");
  }
}
