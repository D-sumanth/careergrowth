"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  admin?: boolean;
  role?: "STUDENT" | "CONSULTANT" | "ADMIN";
};

const studentItems = [
  ["Overview", "/dashboard"],
  ["Bookings", "/dashboard/bookings"],
  ["Reviews", "/dashboard/reviews"],
  ["Documents", "/dashboard/documents"],
  ["Settings", "/dashboard/settings"],
] as const;

const consultantItems = [
  ["Overview", "/dashboard"],
  ["Bookings", "/dashboard/bookings"],
  ["Reviews", "/dashboard/reviews"],
  ["Documents", "/dashboard/documents"],
  ["Availability", "/dashboard/availability"],
  ["Settings", "/dashboard/settings"],
] as const;

const adminItems = [
  ["Overview", "/admin"],
  ["Users", "/admin/users"],
  ["Bookings", "/admin/bookings"],
  ["Availability", "/admin/settings"],
  ["Services", "/admin/services"],
  ["Workshops", "/admin/workshops"],
  ["Content", "/admin/content"],
  ["Posts", "/admin/posts"],
  ["Testimonials", "/admin/testimonials"],
  ["FAQs", "/admin/faqs"],
  ["Inquiries", "/admin/inquiries"],
  ["Reviews", "/admin/reviews"],
  ["Payments", "/admin/payments"],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(`${href}/`));
}

export function DashboardNav({ admin = false, role = "STUDENT" }: DashboardNavProps) {
  const pathname = usePathname();
  const items = admin ? adminItems : role === "CONSULTANT" ? consultantItems : studentItems;

  return (
    <>
      <aside className="hidden w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {admin ? "Admin console" : role === "CONSULTANT" ? "Consultant dashboard" : "Student dashboard"}
        </p>
        <nav className="space-y-1">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
                isActive(pathname, href) && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="-mx-1 overflow-x-auto pb-2 lg:hidden">
        <nav className="flex min-w-max gap-2 px-1">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950",
                isActive(pathname, href) && "border-slate-950 bg-slate-950 text-white hover:text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
