import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { getPublicTestimonials } from "@/lib/content";
import { getInitials } from "@/lib/utils";

export default async function TestimonialsPage() {
  const testimonials = await getPublicTestimonials();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Success stories</p>
          <h1 className="font-serif text-[2.35rem] font-semibold tracking-tight text-slate-950 sm:text-5xl">Student outcomes framed in the same honest, practical tone as the public brand.</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                    {getInitials(item.name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role || item.university || "Career Growth Studio client"}</p>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.serviceType}</p>
              <p className="mt-4 text-base leading-7 text-slate-700">&ldquo;{item.content}&rdquo;</p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
