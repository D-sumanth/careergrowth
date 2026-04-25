import { parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { authErrorFromException, authOk } from "@/lib/auth/errors";
import { assertAllowedAuthOrigin } from "@/lib/auth/request";
import { requestPasswordReset } from "@/lib/auth/users";
import { forgotPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertAllowedAuthOrigin(request);
    assertRateLimit(`forgot-password:${request.headers.get("x-forwarded-for") ?? "local"}`, 5, 60_000);
    const payload = await parseJson(request, forgotPasswordSchema);
    await requestPasswordReset(payload.email);
    return authOk({ successState: "reset-requested" });
  } catch (error) {
    return authErrorFromException(error);
  }
}
