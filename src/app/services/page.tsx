import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/data/site-content";
import { formatCurrency } from "@/lib/utils";

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Services</p>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Career support designed for serious students and recent graduates.</h1>
          <p className="text-lg leading-8 text-slate-600">
            Every service includes clear outcomes, sensible pricing, and a straightforward CTA. This structure is ready for admin-managed pricing, service toggles, and future packages or course products.
          </p>
        </div>
        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.slug} className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="font-serif text-3xl text-slate-950">{service.title}</h2>
                <p className="mt-3 text-base leading-8 text-slate-600">{service.description}</p>
                <p className="mt-4 text-sm font-semibold text-slate-950">Who it is for</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{service.who}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">What is included</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {service.included.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-slate-500">Duration: {service.duration}</p>
                <p className="mt-1 font-semibold text-slate-950">{formatCurrency(service.pricePence)}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href="/sign-up">Book or buy</ButtonLink>
                  <ButtonLink href="/pricing" variant="secondary">
                    View pricing
                  </ButtonLink>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
