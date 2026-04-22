import { getSession } from "@/lib/auth/session";
import { getManagedSiteContent, updateManagedSiteContent } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { siteContentSettingsSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const item = await getManagedSiteContent();
    return jsonOk({ item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load site settings.", 401);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, siteContentSettingsSchema);
    const item = await updateManagedSiteContent(payload);
    return jsonOk({ message: "Site settings updated.", item });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update site settings.");
  }
}
