import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicServices } from "@/lib/content";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getPublicServices();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-4xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Services</p>
          <h1 className="max-w-5xl font-serif text-[2.35rem] font-semibold tracking-tight text-slate-950 sm:text-5xl lg:max-w-4xl">Career support designed around the real questions international students ask during the UK job search.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            The service mix now reflects the strongest themes from Aditi Rahegaonkar&apos;s public content: CV improvement, interview support, job-search strategy, sponsorship awareness, and structured support that feels practical rather than generic.
          </p>
        </div>
        <div className="grid gap-5">
          {services.map((service) => (
            <Card key={service.slug} className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[minmax(240px,320px)_1fr]">
                <div className="bg-slate-100">
                  {service.imageUrl ? (
                    <div className="aspect-[4/3] h-full min-h-[220px] w-full lg:aspect-auto lg:min-h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover object-center" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] h-full min-h-[220px] w-full bg-gradient-to-br from-slate-100 via-white to-amber-50 lg:aspect-auto lg:min-h-full" />
                  )}
                </div>
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="min-w-0">
                    <h2 className="font-serif text-[1.9rem] text-slate-950 sm:text-3xl">{service.title}</h2>
                    <p className="mt-3 text-base leading-7 text-slate-600">{service.description}</p>
                    <p className="mt-4 text-sm font-semibold text-slate-950">Who it is for</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{service.whoItIsFor}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-950">What is included</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {service.includedItems.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-slate-500">Duration: {service.durationLabel}</p>
                    <div className="mt-1 flex items-center gap-2 font-semibold text-slate-950">
                      {service.compareAtPricePence ? <span className="text-sm font-normal text-slate-500 line-through">{formatCurrency(service.compareAtPricePence)}</span> : null}
                      <span>{formatCurrency(service.pricePence)}</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <ButtonLink href={`/services/${service.slug}/book`}>
                        {service.isBookable ? "Book session" : "Request support"}
                      </ButtonLink>
                      <ButtonLink href={`/services/${service.slug}`} variant="secondary">
                        View details
                      </ButtonLink>
                      <ButtonLink href="/pricing" variant="secondary">
                        View pricing
                      </ButtonLink>
                    </div>
                  </div>
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
