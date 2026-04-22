import { getSession } from "@/lib/auth/session";
import { createManagedWorkshop, getManagedWorkshops } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { workshopAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await getManagedWorkshops();
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load workshops.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, workshopAdminSchema);
    const item = await createManagedWorkshop(payload);
    return jsonOk({ message: "Workshop created.", item }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create workshop.");
  }
}
