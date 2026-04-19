import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { workshops } from "@/lib/data/site-content";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function WorkshopsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Workshops</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Live sessions on UK job search, sponsorship awareness, and stronger applications.</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <Card key={workshop.slug} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-600" />
              <div className="space-y-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{workshop.status}</p>
                <h2 className="font-serif text-3xl text-slate-950">{workshop.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{workshop.summary}</p>
                <p className="text-sm text-slate-500">{formatDateTime(workshop.startsAt)}</p>
                <p className="text-sm text-slate-500">
                  Seats: {workshop.sold}/{workshop.seatLimit}
                </p>
                <p className="font-semibold text-slate-950">{formatCurrency(workshop.pricePence)}</p>
                <ButtonLink href="/sign-up">Book / purchase</ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
