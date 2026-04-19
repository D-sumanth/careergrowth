import { getSession } from "@/lib/auth/session";
import { changeCurrentUserPassword } from "@/lib/account";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { accountPasswordSchema } from "@/lib/validation/account";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return jsonError("Authentication required.", 401);

    const payload = await parseJson(request, accountPasswordSchema);
    await changeCurrentUserPassword(session.userId, payload.currentPassword, payload.newPassword);
    return jsonOk({ message: "Password updated successfully." });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update password.");
  }
}
