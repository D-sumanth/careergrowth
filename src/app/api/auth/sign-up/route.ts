import { NextRequest } from "next/server";
import { registerUser } from "@/lib/auth/users";
import { setSessionCookie } from "@/lib/auth/session";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { signUpSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(`signup:${request.headers.get("x-forwarded-for") ?? "local"}`, 6);
    const payload = await parseJson(request, signUpSchema);
    const user = await registerUser(payload);
    await setSessionCookie({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return jsonOk({
      message: user.mock
        ? "Account created in mock mode. Connect PostgreSQL to persist real users."
        : "Account created successfully.",
      redirectTo: "/dashboard",
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to register.", 400);
  }
}
