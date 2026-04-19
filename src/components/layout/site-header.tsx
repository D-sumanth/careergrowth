import { Menu } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/data/site-content";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Workshops", "/workshops"],
  ["Pricing", "/pricing"],
  ["Success Stories", "/testimonials"],
  ["Resources", "/resources"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="flex items-start justify-between gap-4 xl:items-center">
          <Link href="/" className="min-w-0 max-w-sm pr-2">
            <div className="font-serif text-lg font-semibold text-slate-950 sm:text-xl">{siteConfig.consultantName}</div>
            <div className="mt-1 max-w-xs text-sm leading-6 text-slate-500 sm:max-w-sm">{siteConfig.tagline}</div>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-5 px-4 xl:flex 2xl:gap-7">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="whitespace-nowrap text-sm text-slate-700 transition hover:text-slate-950">
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex xl:shrink-0">
            <ButtonLink href="/sign-in" variant="ghost" className="hidden whitespace-nowrap lg:inline-flex">
              Sign in
            </ButtonLink>
            <ButtonLink href="/services" className="whitespace-nowrap">
              Book a Session
            </ButtonLink>
          </div>
          <details className="group lg:hidden xl:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute inset-x-0 top-full mt-3 border-t border-slate-200 bg-white/95 px-5 py-5 shadow-lg backdrop-blur sm:px-8">
              <div className="mx-auto flex max-w-7xl flex-col gap-3">
                {navItems.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100">
                    {label}
                  </Link>
                ))}
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/services" className="w-full">
                    Book a Session
                  </ButtonLink>
                  <ButtonLink href="/sign-in" variant="secondary" className="w-full">
                    Sign in
                  </ButtonLink>
                </div>
              </div>
            </div>
          </details>
        </div>
        <div className="mt-4 flex gap-2 sm:hidden">
          <ButtonLink href="/services" className="flex-1">
            Book a Session
          </ButtonLink>
          <ButtonLink href="/sign-in" variant="secondary" className="flex-1">
            Sign in
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
