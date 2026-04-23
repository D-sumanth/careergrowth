"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthForm({
  mode,
  showDemoHint = false,
  redirectTo,
}: {
  mode: "sign-in" | "sign-up" | "forgot-password" | "reset-password";
  showDemoHint?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  function resolveRedirect(target?: string) {
    if (!target || !target.startsWith("/")) {
      return null;
    }

    return target;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setPending(false);
    setStatus(result.message ?? "Done.");

    if (response.ok && (mode === "sign-in" || mode === "sign-up")) {
      router.push(resolveRedirect(redirectTo) ?? resolveRedirect(result.redirectTo) ?? "/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {mode === "sign-up" ? (
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Full name</span>
          <input name="name" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950" />
        </label>
      ) : null}

      {mode === "reset-password" ? (
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Reset token</span>
          <input name="token" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950" />
        </label>
      ) : null}

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Email</span>
        <input type="email" name="email" required={mode !== "reset-password"} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950" />
      </label>

      {mode !== "forgot-password" ? (
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Password</span>
          <input type="password" name="password" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950" />
        </label>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Working..." : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : mode === "forgot-password" ? "Send reset link" : "Reset password"}
      </Button>

      {status ? <p className="text-sm text-slate-600">{status}</p> : null}

      {mode === "sign-in" && showDemoHint ? (
        <p className="text-xs text-slate-500">
          Demo logins: `student@example.com`, `coach@careergrowthstudio.co.uk`, or `admin@careergrowthstudio.co.uk` with password `Password123!` when mock mode is enabled.
        </p>
      ) : null}
    </form>
  );
}
