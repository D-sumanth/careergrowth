import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { forgotPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, forgotPasswordSchema);
    return jsonOk({
      message: `If ${payload.email} exists, a reset instruction has been prepared. In production, send the token through your configured email provider.`,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to process request.");
  }
}
