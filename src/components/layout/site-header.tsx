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
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0">
            <div className="font-serif text-lg font-semibold text-slate-950 sm:text-xl">{siteConfig.consultantName}</div>
            <div className="text-xs text-slate-500">{siteConfig.tagline}</div>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm text-slate-700 transition hover:text-slate-950">
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <ButtonLink href="/sign-in" variant="ghost" className="hidden md:inline-flex">
              Sign in
            </ButtonLink>
            <ButtonLink href="/services">Book a Session</ButtonLink>
          </div>
          <details className="group lg:hidden">
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
