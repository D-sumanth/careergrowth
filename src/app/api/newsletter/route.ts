import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { readAttributionCookie } from "@/lib/marketing/attribution";
import { newsletterSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = newsletterSchema.parse({
      email: body.email,
      consent: body.consent === true || body.consent === "true" || body.consent === "on",
    });
    const attribution = await readAttributionCookie();

    if (prisma) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: payload.email },
        update: {
          consentedAt: new Date(),
          status: "subscribed",
          source: attribution?.source ?? "website",
          medium: attribution?.medium ?? null,
          campaign: attribution?.campaign ?? null,
          referrer: attribution?.referrer ?? null,
        },
        create: {
          email: payload.email,
          consentedAt: new Date(),
          source: attribution?.source ?? "website",
          medium: attribution?.medium ?? null,
          campaign: attribution?.campaign ?? null,
          referrer: attribution?.referrer ?? null,
        },
      });
    }

    return jsonOk({
      message: `Thanks. ${payload.email} has been added to the newsletter list.`,
    }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to subscribe.");
  }
}
