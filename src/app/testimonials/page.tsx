import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/data/site-content";

export default function TestimonialsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Success stories</p>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Social proof that feels genuine, specific, and relevant.</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.service}</p>
              <p className="mt-4 text-base leading-8 text-slate-700">“{item.quote}”</p>
              <p className="mt-6 font-semibold text-slate-950">{item.name}</p>
              <p className="text-sm text-slate-500">
                {item.role}, {item.university}
              </p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
