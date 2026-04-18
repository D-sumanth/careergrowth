import { NextRequest } from "next/server";
import { authenticateUser } from "@/lib/auth/users";
import { setSessionCookie } from "@/lib/auth/session";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { signInSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(`signin:${request.headers.get("x-forwarded-for") ?? "local"}`, 10);
    const payload = await parseJson(request, signInSchema);
    const user = await authenticateUser(payload.email, payload.password);
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    await setSessionCookie(user);
    return jsonOk({
      message: "Signed in successfully.",
      redirectTo: user.role === "ADMIN" ? "/admin" : "/dashboard",
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to sign in.", 400);
  }
}
