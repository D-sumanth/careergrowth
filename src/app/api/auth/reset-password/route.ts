import { parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { authErrorFromException, authOk } from "@/lib/auth/errors";
import { assertAllowedAuthOrigin } from "@/lib/auth/request";
import { resetPasswordWithToken } from "@/lib/auth/users";
import { resetPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertAllowedAuthOrigin(request);
    assertRateLimit(`reset-password:${request.headers.get("x-forwarded-for") ?? "local"}`, 6, 60_000);
    const payload = await parseJson(request, resetPasswordSchema);
    await resetPasswordWithToken(payload.token, payload.password);
    return authOk({ successState: "password-reset-complete" });
  } catch (error) {
    return authErrorFromException(error);
  }
}
