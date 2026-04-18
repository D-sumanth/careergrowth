import { addMinutes } from "date-fns";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { bookingSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, bookingSchema);
    const start = new Date(payload.startsAt);
    const end = addMinutes(start, 60);

    return jsonOk(
      {
        message: "Booking request recorded. In production, complete payment before confirming the booking record.",
        booking: {
          id: `mock_booking_${Date.now()}`,
          serviceSlug: payload.serviceSlug,
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
          timezone: payload.timezone,
          status: "PENDING",
        },
      },
      201,
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create booking.");
  }
}
