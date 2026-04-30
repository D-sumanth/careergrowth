import { LayoutDashboard, LogIn, Menu, UserPlus } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getPublicSiteContent } from "@/lib/content";
import { HeaderNav } from "@/components/layout/header-nav";
import { ButtonLink } from "@/components/ui/button";
import { SignOutButton } from "@/components/layout/sign-out-button";

const publicNavItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Workshops", "/workshops"],
  ["Pricing", "/pricing"],
  ["Success Stories", "/testimonials"],
  ["Resources", "/resources"],
  ["Contact", "/contact"],
] as const;

export async function SiteHeader({ mode = "public" }: { mode?: "public" | "dashboard" }) {
  const session = await getSession();
  const siteConfig = await getPublicSiteContent();
  const dashboardHref = session?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0 max-w-[13rem] pr-2 sm:max-w-[16rem]">
            <div className="truncate font-serif text-lg font-semibold tracking-tight text-slate-950 sm:text-[1.3rem]">
              {siteConfig.consultantName}
            </div>
            {mode === "public" ? (
              <div className="hidden max-w-[16rem] truncate text-[11px] font-medium text-slate-500 2xl:block">{siteConfig.tagline}</div>
            ) : null}
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
            <HeaderNav items={publicNavItems} />
          </nav>
          <div className="hidden items-center gap-2 lg:flex xl:shrink-0">
            {session ? (
              <>
                <ButtonLink
                  href={dashboardHref}
                  variant={mode === "dashboard" ? "primary" : "secondary"}
                  className="gap-2 whitespace-nowrap"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {session.role === "ADMIN" ? "Admin console" : "Dashboard"}
                </ButtonLink>
                <SignOutButton className="whitespace-nowrap" />
              </>
            ) : (
              <>
                <ButtonLink href="/sign-in" variant="ghost" className="gap-2 whitespace-nowrap">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </ButtonLink>
                <ButtonLink href="/sign-up" variant="secondary" className="gap-2 whitespace-nowrap">
                  <UserPlus className="h-4 w-4" />
                  Create account
                </ButtonLink>
                <ButtonLink href="/services" className="whitespace-nowrap">
                  Book a Session
                </ButtonLink>
              </>
            )}
          </div>
          <details className="group lg:hidden xl:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                {session ? (
                  <Link
                    href={dashboardHref}
                    className="rounded-lg bg-slate-950 px-3 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                  >
                    {session.role === "ADMIN" ? "Admin console" : "Dashboard"}
                  </Link>
                ) : null}
                <HeaderNav items={publicNavItems} mobile />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  {session ? (
                    <>
                      <div className="w-full">
                        <SignOutButton className="w-full justify-center border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ButtonLink href="/services" className="w-full">
                        Book a Session
                      </ButtonLink>
                      <ButtonLink href="/sign-up" variant="secondary" className="w-full">
                        Create account
                      </ButtonLink>
                      <ButtonLink href="/sign-in" variant="secondary" className="w-full">
                        Sign in
                      </ButtonLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
