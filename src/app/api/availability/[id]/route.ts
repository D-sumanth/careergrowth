import { getSession } from "@/lib/auth/session";
import { deleteAvailabilityEntry } from "@/lib/availability";
import { jsonError, jsonOk } from "@/lib/http";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "CONSULTANT")) {
    return jsonError("Authentication required.", 401);
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");

  if (kind !== "rule" && kind !== "override") {
    return jsonError("A valid availability entry type is required.", 400);
  }

  try {
    await deleteAvailabilityEntry({
      id,
      kind,
      actorRole: session.role,
      actorUserId: session.userId,
    });
    return jsonOk({ message: "Availability entry removed." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to remove availability entry.", 400);
  }
}
