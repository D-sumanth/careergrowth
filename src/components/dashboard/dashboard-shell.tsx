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
      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="rounded-lg border border-slate-200/90 bg-white px-4 py-4 shadow-sm sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">
            {admin ? "Admin console" : role === "CONSULTANT" ? "Consultant dashboard" : "Dashboard"}
          </p>
          <div className="mt-1.5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">{title}</h1>
              {description ? <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
          <DashboardNav admin={admin} role={role} />
          <section className="min-w-0 flex-1 space-y-4">{children}</section>
        </div>
      </main>
    </>
  );
}
