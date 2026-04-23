import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { getCheckoutSession } from "@/lib/payments/stripe";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; bookingId?: string; mockCheckout?: string }>;
}) {
  const { session_id: sessionId, bookingId, mockCheckout } = await searchParams;
  const session = sessionId ? await getCheckoutSession(sessionId) : null;
  const paid = mockCheckout === "1" || session?.payment_status === "paid";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Payment successful</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          {paid
            ? "Your payment has been received. Your booking will appear in your dashboard once the confirmation sync completes."
            : "Stripe is still finalising this payment. If you just completed checkout, refresh shortly or check your dashboard bookings."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/bookings" className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            View bookings
          </Link>
          {bookingId ? (
            <Link href={`/services`} className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Browse more services
            </Link>
          ) : null}
        </div>
      </main>
    </>
  );
}
