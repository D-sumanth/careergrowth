import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SiteHeader } from "@/components/layout/site-header";

export function DashboardShell({
  title,
  description,
  children,
  admin = false,
  role = "STUDENT",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  admin?: boolean;
  role?: "STUDENT" | "CONSULTANT" | "ADMIN";
}) {
  return (
    <>
      <SiteHeader mode="dashboard" />
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-orange-50/40 px-5 py-5 shadow-sm sm:px-6 sm:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
            {admin ? "Admin console" : role === "CONSULTANT" ? "Consultant dashboard" : "Dashboard"}
          </p>
          <div className="mt-2 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
              {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start">
          <DashboardNav admin={admin} role={role} />
          <section className="min-w-0 flex-1 space-y-5">{children}</section>
        </div>
      </main>
    </>
  );
}
