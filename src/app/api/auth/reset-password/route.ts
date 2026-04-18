import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { resetPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    await parseJson(request, resetPasswordSchema);
    return jsonOk({
      message: "Password reset flow validated. Persist the reset token in PostgreSQL and update the user password when wiring the final production flow.",
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to reset password.");
  }
}
