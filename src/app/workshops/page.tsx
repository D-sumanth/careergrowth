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
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Workshops</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{siteConfig.workshopsTitle}</h1>
          <p className="text-base leading-8 text-slate-600">{siteConfig.workshopsDescription}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <Card key={workshop.slug} className="overflow-hidden">
              <div
                className="h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-600"
                style={
                  workshop.bannerImageUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(15,23,42,0.4), rgba(217,119,6,0.3)), url(${workshop.bannerImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="space-y-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{workshop.status.replaceAll("_", " ")}</p>
                <h2 className="font-serif text-3xl text-slate-950">{workshop.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{workshop.description}</p>
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
