import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { SiteHeader } from "@/components/layout/site-header";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16 sm:px-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950">Create your account</h1>
        <div className="mt-8">
          <AuthForm mode="sign-up" redirectTo={next} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href={next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in"}>Sign in</Link>
        </p>
      </main>
    </>
  );
}
