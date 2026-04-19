import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { env } from "@/lib/env";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16 sm:px-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950">Sign in</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Secure email/password authentication with role-based route protection and optional OAuth-ready extension points.</p>
        <div className="mt-8">
          <AuthForm mode="sign-in" showDemoHint={env.ENABLE_MOCK_MODE} redirectTo={next} />
        </div>
        <div className="mt-4 flex justify-between text-sm text-slate-600">
          <Link href={next ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up"}>Create account</Link>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </main>
    </>
  );
}
