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
      email: session.email,
      serviceSlug: payload.serviceSlug,
      startsAt: payload.startsAt,
      timezone: payload.timezone,
      notes: payload.notes,
    });

    return jsonOk(
      {
        message: booking.checkout.mode === "mock" ? "Booking confirmed." : "Booking reserved. Continue to secure checkout.",
        booking: booking.booking,
        checkout: booking.checkout,
        redirectTo: booking.checkout.url,
      },
      201,
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create booking.");
  }
}
