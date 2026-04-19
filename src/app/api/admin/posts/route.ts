import { getSession } from "@/lib/auth/session";
import { createManagedPost, getManagedPosts } from "@/lib/content";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { postAdminSchema } from "@/lib/validation/content";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await getManagedPosts();
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load posts.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await parseJson(request, postAdminSchema);
    const item = await createManagedPost(payload);
    return jsonOk({ message: "Post created.", item }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create post.");
  }
}
