import { getSession } from "@/lib/auth/session";
import { createManagedService, getManagedServices } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { serviceAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await getManagedServices();
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load services.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, serviceAdminSchema);
    const item = await createManagedService(payload);
    return jsonOk({ message: "Service created.", item }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create service.");
  }
}
