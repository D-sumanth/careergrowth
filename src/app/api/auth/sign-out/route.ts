import { getSession } from "@/lib/auth/session";
import { clearSessionCookie } from "@/lib/auth/session";
import { jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/lib/auth/audit";
import { assertAllowedAuthOrigin } from "@/lib/auth/request";

export async function POST(request: Request) {
  assertAllowedAuthOrigin(request);
  const session = await getSession();
  await clearSessionCookie();
  if (session) {
    await writeAuditLog({
      actorId: session.userId,
      action: "auth.sign_out",
      entityType: "User",
      entityId: session.userId,
    });
  }
  return jsonOk({ message: "Signed out." });
}
