import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Checkout cancelled</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">No payment has been confirmed. Students can return to services or workshops and try again without losing context.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={service ? `/services/${service}/book` : "/services"}
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to booking
          </Link>
          <Link href="/dashboard/bookings" className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
            View dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
