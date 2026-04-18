import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export function DashboardShell({
  title,
  children,
  admin = false,
}: {
  title: string;
  children: React.ReactNode;
  admin?: boolean;
}) {
  const items = admin
    ? [
        ["Overview", "/admin"],
        ["Users", "/admin/users"],
        ["Bookings", "/admin/bookings"],
        ["Services", "/admin/services"],
        ["Workshops", "/admin/workshops"],
        ["Content", "/admin/content"],
        ["Inquiries", "/admin/inquiries"],
        ["Reviews", "/admin/reviews"],
        ["Payments", "/admin/payments"],
        ["Settings", "/admin/settings"],
      ]
    : [
        ["Overview", "/dashboard"],
        ["Bookings", "/dashboard/bookings"],
        ["Reviews", "/dashboard/reviews"],
        ["Documents", "/dashboard/documents"],
        ["Settings", "/dashboard/settings"],
      ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl gap-6 px-5 py-10 sm:px-8">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{admin ? "Admin console" : "Student dashboard"}</p>
          <nav className="space-y-1">
            {items.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0 flex-1 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          </div>
          {children}
        </section>
      </main>
    </>
  );
}
