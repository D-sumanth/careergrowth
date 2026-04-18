import { addMinutes, formatISO, setHours, setMinutes } from "date-fns";
import { jsonError, jsonOk } from "@/lib/http";
import { availabilityQuerySchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = availabilityQuerySchema.parse({
      serviceSlug: searchParams.get("serviceSlug"),
      date: searchParams.get("date"),
      timezone: searchParams.get("timezone") ?? "Europe/London",
    });

    const day = new Date(payload.date);
    const slots = [10, 12, 15, 17].map((hour) =>
      formatISO(addMinutes(setMinutes(setHours(day, hour), 0), 0)),
    );

    return jsonOk({
      timezone: payload.timezone,
      slots,
      note: "This uses a deterministic mock availability schedule. Replace with Prisma-backed availability rules, overrides, and double-booking checks.",
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load availability.");
  }
}
