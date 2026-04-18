import { jsonOk } from "@/lib/http";

export async function POST() {
  return jsonOk({
    message: "Webhook endpoint ready. Verify the Stripe signature and sync payment state atomically before marking bookings or workshop registrations as confirmed.",
  });
}
