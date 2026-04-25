import { NextRequest } from "next/server";
import { authenticateUser } from "@/lib/auth/users";
import { setSessionCookie } from "@/lib/auth/session";
import { parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { signInSchema } from "@/lib/validation/schemas";
import { authError, authErrorFromException, authOk } from "@/lib/auth/errors";
import { writeAuditLog } from "@/lib/auth/audit";
import { assertAllowedAuthOrigin } from "@/lib/auth/request";

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") ?? "local";

  try {
    assertAllowedAuthOrigin(request);
    assertRateLimit(`signin:${ipAddress}`, 8, 60_000);
    const payload = await parseJson(request, signInSchema);
    const result = await authenticateUser(payload.email, payload.password);

    if (result.status === "invalid") {
      await writeAuditLog({
        action: "auth.sign_in_failure",
        entityType: "Credential",
        entityId: payload.email,
        metadata: { ipAddress },
      });
      return authError("INVALID_CREDENTIALS", 401);
    }

    if (result.status === "unverified") {
      return authError("EMAIL_NOT_VERIFIED", 403);
    }

    await setSessionCookie(result.user, { rememberMe: payload.rememberMe });
    await writeAuditLog({
      actorId: result.user.userId,
      action: "auth.sign_in_success",
      entityType: "User",
      entityId: result.user.userId,
      metadata: { ipAddress, rememberMe: payload.rememberMe },
    });

    return authOk({
      redirectTo: result.user.role === "ADMIN" ? "/admin" : "/dashboard",
    });
  } catch (error) {
    return authErrorFromException(error);
  }
}
