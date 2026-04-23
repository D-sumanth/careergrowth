import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";
import { jsonError, jsonOk } from "@/lib/http";
import { syncCheckoutSessionCompleted, syncCheckoutSessionFailed, verifyStripeWebhook } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const event = verifyStripeWebhook(payload, signature);

    switch (event.type) {
      case "checkout.session.completed":
        await syncCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.expired":
        await syncCheckoutSessionFailed(event.data.object as Stripe.Checkout.Session, PaymentStatus.CANCELLED);
        break;
      case "checkout.session.async_payment_failed":
        await syncCheckoutSessionFailed(event.data.object as Stripe.Checkout.Session, PaymentStatus.FAILED);
        break;
      default:
        break;
    }

    return jsonOk({ received: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Webhook processing failed.", 400);
  }
}
