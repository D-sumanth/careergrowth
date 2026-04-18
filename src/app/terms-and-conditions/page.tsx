import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-5 px-5 py-16 sm:px-8">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Policies</h1>
        <p className="text-base leading-8 text-slate-600">
          Replace this placeholder content with your final legal copy for privacy, terms, refunds, cancellations, and cookies. The route structure is already in place and easy to expand into separate rich policy documents later.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
