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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="min-w-0">
          <div className="font-serif text-xl font-semibold text-slate-950">{siteConfig.name}</div>
          <div className="text-xs text-slate-500">UK career support for ambitious students</div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-slate-700 transition hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/sign-in" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </ButtonLink>
          <ButtonLink href="/services">Book a Session</ButtonLink>
        </div>
      </div>
    </header>
  );
}
