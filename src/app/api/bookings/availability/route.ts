import { getAvailabilityForServiceDate } from "@/lib/bookings";
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

    const availability = await getAvailabilityForServiceDate(payload);
    return jsonOk(availability);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load availability.");
  }
}
