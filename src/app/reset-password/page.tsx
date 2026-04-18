import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";

export default function ResetPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16 sm:px-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950">Reset password</h1>
        <div className="mt-8">
          <AuthForm mode="reset-password" />
        </div>
      </main>
    </>
  );
}
