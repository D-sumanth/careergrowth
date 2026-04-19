import { getSession, setSessionCookie } from "@/lib/auth/session";
import { getCurrentUserAccount, updateCurrentUserAccount } from "@/lib/account";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { accountProfileSchema } from "@/lib/validation/account";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Authentication required.", 401);

  const account = await getCurrentUserAccount(session.userId);
  return jsonOk({ account });
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return jsonError("Authentication required.", 401);

    const payload = await parseJson(request, accountProfileSchema);
    const account = await updateCurrentUserAccount(session.userId, payload);

    await setSessionCookie({
      userId: session.userId,
      email: session.email,
      name: payload.name,
      role: session.role,
    });

    return jsonOk({ message: "Profile updated.", account });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update profile.");
  }
}
