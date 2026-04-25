import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { getSession } from "@/lib/auth/session";
import { isOAuthProviderConfigured } from "@/lib/auth/oauth";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, session] = await Promise.all([searchParams, getSession()]);
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="max-w-xl">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
            Student account setup
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Create your Career Growth Studio account.</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Set up your account to book support sessions, upload CVs, and keep everything in one secure place as you work toward a graduate role in the UK.
          </p>
          <div className="mt-8 space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">What happens next</p>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>1. Create your account with a strong password.</li>
              <li>2. Verify your email before using sensitive account actions.</li>
              <li>3. Return straight to your dashboard or the booking flow you started.</li>
            </ul>
          </div>
        </section>

        <section>
          <AuthForm
            mode="sign-up"
            redirectTo={next}
            oauthProviders={{
              google: isOAuthProviderConfigured("google"),
              linkedin: isOAuthProviderConfigured("linkedin"),
            }}
          />
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href={next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in"} className="font-semibold text-slate-900 hover:text-slate-700">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
