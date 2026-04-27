"use client";

import type { ComponentType } from "react";
import {
  BarChart3,
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

type NavItem = readonly [string, string, ComponentType<{ className?: string }>];

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

const adminSections: ReadonlyArray<{ label: string; items: readonly NavItem[] }> = [
  {
    label: "Insights",
    items: [
      ["Overview", "/admin", Home],
      ["Analytics", "/admin/analytics", BarChart3],
      ["CRM", "/admin/crm", Mail],
    ],
  },
  {
    label: "People",
    items: [
      ["Users", "/admin/users", Users],
      ["Inquiries", "/admin/inquiries", Mail],
      ["Reviews", "/admin/reviews", FileStack],
    ],
  },
  {
    label: "Operations",
    items: [
      ["Bookings", "/admin/bookings", CalendarDays],
      ["Payments", "/admin/payments", CreditCard],
      ["Availability", "/admin/settings", CalendarClock],
    ],
  },
  {
    label: "Offers",
    items: [
      ["Services", "/admin/services", BriefcaseBusiness],
      ["Workshops", "/admin/workshops", LayoutGrid],
    ],
  },
  {
    label: "Publishing",
    items: [
      ["Content", "/admin/content", LayoutGrid],
      ["Posts", "/admin/posts", BookOpenText],
      ["Testimonials", "/admin/testimonials", MessageSquareQuote],
      ["FAQs", "/admin/faqs", CircleHelp],
    ],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(`${href}/`));
}

export function DashboardNav({ admin = false, role = "STUDENT" }: DashboardNavProps) {
  const pathname = usePathname();
  const items: readonly NavItem[] = admin ? adminSections.flatMap((section) => section.items) : role === "CONSULTANT" ? consultantItems : studentItems;

  return (
    <>
      <aside className="hidden w-56 shrink-0 rounded-[1.75rem] border border-slate-200/90 bg-white p-4 shadow-sm lg:block lg:sticky lg:top-24">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {admin ? "Admin console" : role === "CONSULTANT" ? "Consultant dashboard" : "Student dashboard"}
        </p>
        {admin ? (
          <nav className="space-y-4">
            {adminSections.map((section) => (
              <div key={section.label} className="space-y-1">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{section.label}</p>
                {section.items.map(([label, href, Icon]) => (
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
              </div>
            ))}
          </nav>
        ) : (
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
        )}
      </aside>

      <div className="-mx-1 overflow-x-auto pb-1 lg:hidden">
        {admin ? (
          <div className="space-y-3 px-1">
            {adminSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{section.label}</p>
                <nav className="flex min-w-max gap-2">
                  {section.items.map(([label, href, Icon]) => (
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
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
