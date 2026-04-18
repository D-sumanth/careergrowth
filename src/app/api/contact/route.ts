import { sendTransactionalEmail } from "@/lib/email";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { assertRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertRateLimit("contact", 12);
    const payload = await parseJson(request, contactSchema);
    await sendTransactionalEmail({
      to: payload.email,
      subject: "We received your inquiry",
      html: `<p>Hi ${payload.name},</p><p>Thanks for reaching out. We have received your ${payload.category.toLowerCase().replaceAll("_", " ")} inquiry and will be in touch soon.</p>`,
    });
    return jsonOk({ message: "Your inquiry has been received. Check your inbox for confirmation." }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to submit inquiry.");
  }
}
