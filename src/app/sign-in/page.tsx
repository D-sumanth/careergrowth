import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { env } from "@/lib/env";
import { getSession } from "@/lib/auth/session";
import { isOAuthProviderConfigured } from "@/lib/auth/oauth";
import { mapAuthSearchError } from "@/lib/auth/ui";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [{ next, error }, session] = await Promise.all([searchParams, getSession()]);
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="max-w-xl">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            Career Growth Studio
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Sign in to continue where you left off.</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Access your dashboard, review requests, bookings, and delivered documents with a smoother, security-first sign-in flow.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
              <p className="font-semibold text-slate-900">Clear next steps</p>
              <p className="mt-2 leading-7">After sign-in you&apos;ll land back on the booking or dashboard page you intended to visit.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
              <p className="font-semibold text-slate-900">Secure by default</p>
              <p className="mt-2 leading-7">Protected sessions, verification-aware flows, and safer reset handling are built into the experience.</p>
            </div>
          </div>
        </section>

        <section>
          <AuthForm
            mode="sign-in"
            showDemoHint={env.ENABLE_MOCK_MODE}
            redirectTo={next}
            initialErrorCode={mapAuthSearchError(error)}
            oauthProviders={{
              google: isOAuthProviderConfigured("google"),
              linkedin: isOAuthProviderConfigured("linkedin"),
            }}
          />
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              New here?{" "}
              <Link href={next ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up"} className="font-semibold text-slate-900 hover:text-slate-700">
                Create your account
              </Link>
            </p>
            <Link href="/forgot-password" className="font-semibold text-slate-900 hover:text-slate-700">
              Forgot password?
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
