"use client";

import {
  BookOpenText,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CircleHelp,
  CreditCard,
  FileStack,
  FolderOpen,
  Home,
  LayoutGrid,
  Mail,
  MessageSquareQuote,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  admin?: boolean;
  role?: "STUDENT" | "CONSULTANT" | "ADMIN";
};

const studentItems = [
  ["Overview", "/dashboard", Home],
  ["Bookings", "/dashboard/bookings", CalendarDays],
  ["Reviews", "/dashboard/reviews", FileStack],
  ["Documents", "/dashboard/documents", FolderOpen],
  ["Settings", "/dashboard/settings", Settings],
] as const;

const consultantItems = [
  ["Overview", "/dashboard", Home],
  ["Bookings", "/dashboard/bookings", CalendarDays],
  ["Reviews", "/dashboard/reviews", FileStack],
  ["Documents", "/dashboard/documents", FolderOpen],
  ["Availability", "/dashboard/availability", CalendarClock],
  ["Settings", "/dashboard/settings", Settings],
] as const;

const adminItems = [
  ["Overview", "/admin", Home],
  ["Users", "/admin/users", Users],
  ["Bookings", "/admin/bookings", CalendarDays],
  ["Availability", "/admin/settings", CalendarClock],
  ["Services", "/admin/services", BriefcaseBusiness],
  ["Workshops", "/admin/workshops", LayoutGrid],
  ["Content", "/admin/content", LayoutGrid],
  ["Posts", "/admin/posts", BookOpenText],
  ["Testimonials", "/admin/testimonials", MessageSquareQuote],
  ["FAQs", "/admin/faqs", CircleHelp],
  ["Inquiries", "/admin/inquiries", Mail],
  ["Reviews", "/admin/reviews", FileStack],
  ["Payments", "/admin/payments", CreditCard],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(`${href}/`));
}

export function DashboardNav({ admin = false, role = "STUDENT" }: DashboardNavProps) {
  const pathname = usePathname();
  const items = admin ? adminItems : role === "CONSULTANT" ? consultantItems : studentItems;

  return (
    <>
      <aside className="hidden w-56 shrink-0 rounded-[1.75rem] border border-slate-200/90 bg-white p-4 shadow-sm lg:block lg:sticky lg:top-24">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {admin ? "Admin console" : role === "CONSULTANT" ? "Consultant dashboard" : "Student dashboard"}
        </p>
        <nav className="space-y-1">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
                isActive(pathname, href) && "bg-slate-950 text-white shadow-sm hover:bg-slate-950 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="-mx-1 overflow-x-auto pb-1 lg:hidden">
        <nav className="flex min-w-max gap-2 px-1">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950",
                isActive(pathname, href) && "border-slate-950 bg-slate-950 text-white hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
