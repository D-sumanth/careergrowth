import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PolicyLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl space-y-8 px-5 py-14 sm:px-8 sm:py-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Policy</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">{intro}</p>
        </div>
        <div className="space-y-8 text-sm leading-8 text-slate-700">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
