import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicSiteContent } from "@/lib/content";

export default async function AboutPage() {
  const siteConfig = await getPublicSiteContent();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-5 py-16 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">About the consultant</p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{siteConfig.aboutTitle}</h1>
            <p className="text-lg leading-8 text-slate-600">{siteConfig.aboutIntro}</p>
            <p className="text-base leading-8 text-slate-600">{siteConfig.aboutBody}</p>
            <ButtonLink href="/services">Book a Session</ButtonLink>
          </div>
          <Card className="bg-gradient-to-br from-amber-100 via-white to-orange-100 p-8">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="font-serif text-3xl">Mission and values</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {siteConfig.values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
