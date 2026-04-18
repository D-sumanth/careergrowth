import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe =
  env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: env.STRIPE_API_VERSION as never,
      })
    : null;

export async function createCheckoutForService(input: {
  title: string;
  amountPence: number;
  successPath: string;
  cancelPath: string;
  metadata?: Record<string, string>;
}) {
  if (!stripe) {
    return {
      id: `mock_checkout_${Date.now()}`,
      url: `${env.APP_URL}${input.successPath}?mockCheckout=1`,
      mode: "mock",
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.APP_URL}${input.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}${input.cancelPath}`,
    currency: env.STRIPE_CURRENCY,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: env.STRIPE_CURRENCY,
          unit_amount: input.amountPence,
          product_data: { name: input.title },
        },
      },
    ],
    metadata: input.metadata,
  });

  return { id: session.id, url: session.url, mode: "live" };
}
