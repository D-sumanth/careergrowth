import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicSiteContent, getPublicWorkshops } from "@/lib/content";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function WorkshopsPage() {
  const [workshops, siteConfig] = await Promise.all([getPublicWorkshops(), getPublicSiteContent()]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Workshops</p>
          <h1 className="font-serif text-[2.35rem] font-semibold tracking-tight text-slate-950 sm:text-5xl">{siteConfig.workshopsTitle}</h1>
          <p className="text-base leading-7 text-slate-600 sm:leading-8">{siteConfig.workshopsDescription}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <Card key={workshop.slug} className="overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-amber-600">
                {workshop.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={workshop.imageUrl} alt={workshop.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{workshop.status.replaceAll("_", " ")}</p>
                <h2 className="font-serif text-[1.9rem] text-slate-950 sm:text-3xl">{workshop.title}</h2>
                <p className="text-sm leading-6 text-slate-600">{workshop.description}</p>
                <p className="text-sm text-slate-500">{formatDateTime(workshop.startsAt, workshop.timezone)}</p>
                <p className="text-sm text-slate-500">
                  Seats: {workshop.soldCount}/{workshop.seatLimit}
                </p>
                <div className="flex items-center gap-2 font-semibold text-slate-950">
                  {workshop.compareAtPricePence ? <span className="text-sm font-normal text-slate-500 line-through">{formatCurrency(workshop.compareAtPricePence)}</span> : null}
                  <span>{formatCurrency(workshop.pricePence)}</span>
                </div>
                <ButtonLink href="/sign-up">{workshop.isBookable ? "Book / purchase" : "View details"}</ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
