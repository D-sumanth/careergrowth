import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/data/site-content";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-5 py-16 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">About the consultant</p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Practical UK job-search support shaped by lived experience, not generic advice.</h1>
            <p className="text-lg leading-8 text-slate-600">
              {siteConfig.consultantName} publicly shares content centred on helping international students and graduates navigate UK applications, interviews, sponsorship questions, and the emotional pressure that often comes with the process.
            </p>
            <p className="text-base leading-8 text-slate-600">
              The tone of the brand is intentionally practical and reassuring. The message is not that there is a magic formula, but that students can get better results with clearer strategy, stronger positioning, and support that actually understands their reality.
            </p>
            <ButtonLink href="/services">Book a Session</ButtonLink>
          </div>
          <Card className="bg-gradient-to-br from-amber-100 via-white to-orange-100 p-8">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="font-serif text-3xl">Mission and values</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <li>Practical guidance over vague motivation</li>
                <li>Support that understands international student realities in the UK</li>
                <li>Career strategy that includes sponsorship and timing, not just CV formatting</li>
                <li>Confidence built through clarity, preparation, and honest feedback</li>
              </ul>
            </div>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
