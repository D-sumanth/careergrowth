import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { getSession } from "@/lib/auth/session";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [params, session] = await Promise.all([searchParams, getSession()]);
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="max-w-lg">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Choose a new password.</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Create a strong password that you haven&apos;t used elsewhere. If this link has expired, request a new reset email.
          </p>
          {!params.token ? (
            <p className="mt-6 text-sm leading-7 text-rose-600">
              This page was opened without a reset token.{" "}
              <Link href="/forgot-password" className="font-semibold text-slate-900 underline underline-offset-4">
                Request a new reset link
              </Link>
              .
            </p>
          ) : null}
        </section>
        <section>
          <AuthForm mode="reset-password" token={params.token} />
        </section>
      </main>
    </>
  );
}
