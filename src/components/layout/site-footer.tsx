import Link from "next/link";
import { siteConfig } from "@/lib/data/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="space-y-3">
          <h3 className="font-serif text-2xl text-white">{siteConfig.name}</h3>
          <p className="text-sm leading-7 text-slate-400">
            Career coaching and UK job-search guidance designed to make the process clearer for international students and graduates.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</h4>
          <p className="text-sm">{siteConfig.email}</p>
          <p className="text-sm">{siteConfig.phone}</p>
          <p className="text-sm">{siteConfig.location}</p>
          <a href={siteConfig.linkedin} className="text-sm underline-offset-4 hover:underline">
            LinkedIn profile
          </a>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Navigate</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/services">Services</Link>
            <Link href="/workshops">Workshops</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/resources">Resources</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Policies</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            <Link href="/refund-cancellation-policy">Refund / Cancellation</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
