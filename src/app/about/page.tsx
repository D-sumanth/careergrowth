import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-5 py-16 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">About the consultant</p>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Warm, practical support for students who want real progress.</h1>
            <p className="text-lg leading-8 text-slate-600">
              Priya Shah works mostly with Indian students and recent graduates in the UK who want clearer positioning, stronger applications, and more confidence navigating a competitive job market.
            </p>
            <p className="text-base leading-8 text-slate-600">
              The approach blends honest market insight with mentor-like guidance. Students come for strategy, clarity, and feedback that feels specific enough to act on immediately.
            </p>
            <ButtonLink href="/services">Book a Session</ButtonLink>
          </div>
          <Card className="bg-gradient-to-br from-amber-100 via-white to-orange-100 p-8">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="font-serif text-3xl">Mission and values</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <li>Practical advice over vague encouragement</li>
                <li>Career growth with confidence, not pressure</li>
                <li>Support that understands international student realities</li>
                <li>Professional standards without cold or generic coaching</li>
              </ul>
            </div>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
