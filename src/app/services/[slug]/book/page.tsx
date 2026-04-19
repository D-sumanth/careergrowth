import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getServiceBySlug } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, session] = await Promise.all([getServiceBySlug(slug), getSession()]);

  if (!service) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-orange-50 via-white to-slate-50 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Book a service</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{service.description}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {service.durationMinutes ? `${service.durationMinutes} minutes` : "Custom delivery"}
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">{formatCurrency(service.pricePence)}</span>
          </div>
        </div>

        {!service.isBookable ? (
          <Card className="p-8">
            <h2 className="font-semibold text-slate-950">This service uses a custom workflow</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              This offer is better handled as a review, workshop, or structured support request rather than a calendar session. Use the contact form for the next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Contact Aditi</ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Back to services
              </ButtonLink>
            </div>
          </Card>
        ) : session ? (
          <BookingForm
            service={{
              slug: service.slug,
              title: service.title,
              description: service.description,
              durationMinutes: service.durationMinutes ?? 60,
              pricePence: service.pricePence,
            }}
          />
        ) : (
          <Card className="p-8">
            <h2 className="font-semibold text-slate-950">Sign in to continue your booking</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Booking times are tied to your account so they can appear in your dashboard, reminders, and future session history.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/sign-in?next=/services/${service.slug}/book`}>Sign in</ButtonLink>
              <ButtonLink href="/sign-up" variant="secondary">
                Create account
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Prefer to browse first? <Link href="/services" className="underline underline-offset-4">Return to services</Link>.
            </p>
          </Card>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
