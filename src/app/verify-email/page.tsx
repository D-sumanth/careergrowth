import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { verifyEmailAddress } from "@/lib/auth/users";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmailAddress(token) : { status: "invalid" as const };

  const message =
    result.status === "verified"
      ? "Your email has been verified successfully. You can sign in and continue."
      : result.status === "expired"
        ? "That verification link has expired. Please request a new verification email."
        : "That verification link is invalid. Please sign in and request a fresh verification email if needed.";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.35)]">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Email verification
          </div>
          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-slate-950">Account verification</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{message}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Go to sign in
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Browse services
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
