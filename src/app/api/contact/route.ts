import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { readAttributionCookie } from "@/lib/marketing/attribution";
import { assertRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertRateLimit("contact", 12);
    const payload = await parseJson(request, contactSchema);
    const attribution = await readAttributionCookie();

    if (prisma) {
      await prisma.inquiry.create({
        data: {
          name: payload.name,
          email: payload.email,
          mobileNumber: payload.mobileNumber || null,
          category: payload.category,
          subject: payload.subject,
          message: payload.message,
          source: attribution?.source ?? null,
          medium: attribution?.medium ?? null,
          campaign: attribution?.campaign ?? null,
          referrer: attribution?.referrer ?? null,
        },
      });
    }

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
