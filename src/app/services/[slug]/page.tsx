import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicServiceBySlug } from "@/lib/content";
import { formatCurrency, getYouTubeEmbedUrl } from "@/lib/utils";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const embedUrl = getYouTubeEmbedUrl(service.videoUrl);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          {service.imageUrl ? (
            <div className="aspect-[16/7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Service details</p>
              <h1 className="mt-4 font-serif text-[2.35rem] font-semibold tracking-tight text-slate-950 sm:text-5xl">{service.title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:leading-8">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">{service.durationLabel}</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">{service.bookingKind.replaceAll("_", " ")}</span>
              </div>
            </div>

            <Card className="p-5 sm:p-6">
              <p className="text-sm font-semibold text-slate-950">Pricing</p>
              <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-950">
                {service.compareAtPricePence ? <span className="text-base font-normal text-slate-400 line-through">{formatCurrency(service.compareAtPricePence)}</span> : null}
                <span>{formatCurrency(service.pricePence)}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-950">Who it is for</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{service.whoItIsFor}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={service.isBookable ? `/services/${service.slug}/book` : "/contact"}>
                  {service.isBookable ? "Book session" : "Request support"}
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  Back to services
                </ButtonLink>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5 sm:p-6 lg:p-8">
            <h2 className="font-serif text-3xl text-slate-950">What&apos;s included</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              {service.includedItems.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 sm:p-6 lg:p-8">
            <h2 className="font-serif text-3xl text-slate-950">Need help deciding?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              If you&apos;re not sure whether this is the right support option yet, you can book later and first ask a question about your situation, documents, or job-search stage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Ask a question</ButtonLink>
              <Link href={`/services/${service.slug}/book`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Continue to booking
              </Link>
            </div>
          </Card>
        </section>

        {embedUrl ? (
          <section>
            <Card className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Watch how this works</p>
              <h2 className="mt-3 font-serif text-3xl text-slate-950">Introduction video</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                A quick walkthrough to help students understand what this support looks like before they book.
              </p>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title={`${service.title} video`}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </Card>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
