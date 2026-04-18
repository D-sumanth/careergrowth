import { SiteHeader } from "@/components/layout/site-header";

export default function CheckoutSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Payment successful</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">Your booking or purchase has been recorded. In production, this page is paired with webhook-based status sync so confirmations are not dependent on client redirects alone.</p>
      </main>
    </>
  );
}
