import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SiteHeader } from "@/components/layout/site-header";

export function DashboardShell({
  title,
  description,
  children,
  admin = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  admin?: boolean;
}) {
  return (
    <>
      <SiteHeader mode="dashboard" />
      <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-orange-50/40 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">{admin ? "Admin console" : "Dashboard"}</p>
          <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
              {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <DashboardNav admin={admin} />
        <section className="min-w-0 flex-1 space-y-6">
          {children}
        </section>
        </div>
      </main>
    </>
  );
}
