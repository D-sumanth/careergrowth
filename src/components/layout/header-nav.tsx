"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type HeaderNavProps = {
  items: ReadonlyArray<readonly [string, string]>;
  mobile?: boolean;
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav({ items, mobile = false }: HeaderNavProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <>
        {items.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
              isActive(pathname, href) && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white",
            )}
          >
            {label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
            isActive(pathname, href) && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white",
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
