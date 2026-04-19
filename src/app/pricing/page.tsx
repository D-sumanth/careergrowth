import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { packages, services } from "@/lib/data/site-content";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-10 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Pricing</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Straightforward pricing for support that helps students move with more clarity.</h1>
        </div>
        <section className="grid gap-6 md:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <Card key={service.slug} className="p-6">
              <h2 className="font-serif text-3xl text-slate-950">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              <p className="mt-5 text-sm text-slate-500">{service.duration}</p>
              <p className="mt-1 font-semibold text-slate-950">{formatCurrency(service.pricePence)}</p>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {packages.map((item) => (
            <Card key={item.title} className="bg-slate-950 p-6 text-white">
              <h2 className="font-serif text-3xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              <p className="mt-5 font-semibold">{formatCurrency(item.pricePence)}</p>
            </Card>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
