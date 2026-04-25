import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { getSession } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="max-w-lg">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Reset your password without the stress.</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Enter the email linked to your account. If we find a match, we&apos;ll prepare reset instructions and keep the response intentionally generic for your privacy.
          </p>
        </section>
        <section>
          <AuthForm mode="forgot-password" />
        </section>
      </main>
    </>
  );
}
