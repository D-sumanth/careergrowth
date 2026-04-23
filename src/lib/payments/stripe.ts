import Stripe from "stripe";
import { addMinutes } from "date-fns";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const stripe =
  env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: env.STRIPE_API_VERSION as never,
      })
    : null;

function getAbsoluteUrl(path: string) {
  return `${env.APP_URL}${path}`;
}

export async function createCheckoutForBooking(input: {
  bookingId: string;
  paymentId: string;
  title: string;
  amountPence: number;
  userId: string;
  email?: string | null;
  serviceSlug: string;
}) {
  if (!stripe) {
    return {
      id: `mock_checkout_${Date.now()}`,
      url: getAbsoluteUrl(`/checkout/success?bookingId=${input.bookingId}&mockCheckout=1`),
      mode: "mock" as const,
    };
  }

  const expiresAt = Math.floor(addMinutes(new Date(), 30).getTime() / 1000);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: getAbsoluteUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${input.bookingId}`),
    cancel_url: getAbsoluteUrl(`/checkout/cancel?bookingId=${input.bookingId}&service=${input.serviceSlug}`),
    currency: env.STRIPE_CURRENCY,
    customer_email: input.email ?? undefined,
    client_reference_id: input.bookingId,
    expires_at: expiresAt,
    payment_intent_data: {
      metadata: {
        bookingId: input.bookingId,
        paymentId: input.paymentId,
        userId: input.userId,
        serviceSlug: input.serviceSlug,
      },
    },
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
    metadata: {
      bookingId: input.bookingId,
      paymentId: input.paymentId,
      userId: input.userId,
      serviceSlug: input.serviceSlug,
    },
  });

  return { id: session.id, url: session.url, mode: "live" as const };
}

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
      mode: "mock" as const,
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

  return { id: session.id, url: session.url, mode: "live" as const };
}

export function verifyStripeWebhook(payload: string, signature: string | null) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook secret is not configured.");
  }

  if (!signature) {
    throw new Error("Missing Stripe signature.");
  }

  return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
}

export async function getCheckoutSession(sessionId: string) {
  if (!stripe) return null;
  return stripe.checkout.sessions.retrieve(sessionId);
}

export async function markMockBookingPaid(bookingId: string) {
  if (!prisma) return null;

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.SUCCEEDED,
        paymentRequired: false,
      },
      include: { service: true },
    });

    await tx.payment.updateMany({
      where: { bookingId },
      data: {
        status: PaymentStatus.SUCCEEDED,
      },
    });

    return booking;
  });
}

export async function syncCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!prisma) return;

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    throw new Error("Checkout session is missing booking metadata.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.SUCCEEDED,
        paymentRequired: false,
        stripeCheckoutId: session.id,
      },
    });

    await tx.payment.updateMany({
      where: { bookingId },
      data: {
        status: PaymentStatus.SUCCEEDED,
        stripeCheckoutId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        metadata: session.metadata ?? undefined,
      },
    });
  });
}

export async function syncCheckoutSessionFailed(session: Stripe.Checkout.Session, status: PaymentStatus) {
  if (!prisma) return;

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    throw new Error("Checkout session is missing booking metadata.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: status,
        stripeCheckoutId: session.id,
      },
    });

    await tx.payment.updateMany({
      where: { bookingId },
      data: {
        status,
        stripeCheckoutId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        metadata: session.metadata ?? undefined,
      },
    });
  });
}
