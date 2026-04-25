import { NextRequest } from "next/server";
import { registerUser } from "@/lib/auth/users";
import { parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { signUpSchema } from "@/lib/validation/schemas";
import { authErrorFromException, authOk } from "@/lib/auth/errors";
import { assertAllowedAuthOrigin } from "@/lib/auth/request";

export async function POST(request: NextRequest) {
  try {
    assertAllowedAuthOrigin(request);
    assertRateLimit(`signup:${request.headers.get("x-forwarded-for") ?? "local"}`, 5, 60_000);
    const payload = await parseJson(request, signUpSchema);
    const user = await registerUser(payload);
    return authOk({
      successState: user.mock ? "mock-account-created" : "verification-required",
    });
  } catch (error) {
    return authErrorFromException(error);
  }
}
