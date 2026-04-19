import { createBookingForCurrentUser } from "@/lib/bookings";
import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { bookingSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return jsonError("Authentication required.", 401);
    }
    const payload = await parseJson(request, bookingSchema);
    const booking = await createBookingForCurrentUser({
      userId: session.userId,
      serviceSlug: payload.serviceSlug,
      startsAt: payload.startsAt,
      timezone: payload.timezone,
      notes: payload.notes,
    });

    return jsonOk(
      {
        message: "Booking confirmed. It is now visible in your dashboard.",
        booking,
        redirectTo: "/dashboard/bookings",
      },
      201,
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create booking.");
  }
}
