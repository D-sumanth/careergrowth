import { jsonError, jsonOk } from "@/lib/http";
import { newsletterSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = newsletterSchema.parse({
      email: body.email,
      consent: body.consent === true || body.consent === "true" || body.consent === "on",
    });

    return jsonOk({
      message: `Thanks. ${payload.email} has been added to the newsletter list.`,
    }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to subscribe.");
  }
}
