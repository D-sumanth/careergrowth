"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CircleAlert, CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authErrorMessages, type AuthErrorCode } from "@/lib/auth/errors";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

type AuthFormProps = {
  mode: AuthMode;
  showDemoHint?: boolean;
  redirectTo?: string;
  token?: string;
  initialErrorCode?: AuthErrorCode | null;
  oauthProviders?: {
    google: boolean;
    linkedin: boolean;
  };
};

type AuthResponse = {
  ok?: boolean;
  code?: AuthErrorCode;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
  successState?: string;
};

function resolveRedirect(target?: string) {
  if (!target || !target.startsWith("/")) return null;
  return target;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.6 2.8-4 2.8-6.8 0-.7-.1-1.4-.2-2H12Z" />
      <path fill="#34A853" d="M12 21c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5C4.8 18.8 8.1 21 12 21Z" />
      <path fill="#FBBC05" d="M6.4 12.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.2 6.6C2.4 8 2 9.5 2 11s.4 3 1.2 4.4l3.2-2.5Z" />
      <path fill="#4285F4" d="M12 5c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1 12 1 8.1 1 4.8 3.2 3.2 6.6l3.2 2.5C7.2 6.7 9.4 5 12 5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.48v6.26ZM5.31 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.09 20.45H3.53V9h3.56v11.45Z"
      />
    </svg>
  );
}

export function AuthForm({
  mode,
  showDemoHint = false,
  redirectTo,
  token,
  initialErrorCode,
  oauthProviders = { google: false, linkedin: false },
}: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [providerPending, setProviderPending] = useState<"google" | "linkedin" | null>(null);
  const [formError, setFormError] = useState<string | null>(initialErrorCode ? authErrorMessages[initialErrorCode] : null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordChecks = useMemo(
    () => [
      { label: "At least 8 characters", valid: password.length >= 8 },
      { label: "Includes uppercase and lowercase letters", valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
      { label: "Includes a number", valid: /[0-9]/.test(password) },
      { label: "Includes a special character", valid: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );

  function setInlineError(field: string, message: string) {
    setFieldErrors((current) => ({ ...current, [field]: message }));
  }

  function clearMessages() {
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});
  }

  function validateClientSide() {
    const nextErrors: Record<string, string> = {};

    if (mode !== "reset-password" && !email.trim()) {
      nextErrors.email = "Email is required.";
    } else if ((mode !== "reset-password" || email) && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (mode === "sign-up" && name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    if (mode === "sign-in" && !password) {
      nextErrors.password = "Password is required.";
    }

    if (mode === "sign-up" || mode === "reset-password") {
      if (!password) {
        nextErrors.password = "Password is required.";
      } else {
        const failedRule = passwordChecks.find((rule) => !rule.valid);
        if (failedRule) nextErrors.password = failedRule.label;
      }

      if (!confirmPassword) {
        nextErrors.confirmPassword = "Please confirm your password.";
      } else if (confirmPassword !== password) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (mode === "sign-up" && !acceptTerms) {
      nextErrors.acceptTerms = "Please accept the Terms and Privacy Policy.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function getSuccessMessage(successState?: string) {
    switch (successState) {
      case "verification-required":
        return "Account created successfully. Please check your email to verify your account.";
      case "mock-account-created":
        return "Account created successfully. In local mock mode, you can sign in right away.";
      case "reset-requested":
        return "If an account exists for this email, we'll send reset instructions.";
      case "password-reset-complete":
        return "Your password has been updated. You can sign in with your new password now.";
      default:
        return null;
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    if (!validateClientSide()) return;

    setPending(true);
    const payload: Record<string, unknown> = {};

    if (mode === "sign-in") {
      payload.email = email.trim();
      payload.password = password;
      payload.rememberMe = rememberMe;
    } else if (mode === "sign-up") {
      payload.name = name.trim();
      payload.email = email.trim();
      payload.password = password;
      payload.confirmPassword = confirmPassword;
      payload.acceptTerms = acceptTerms;
    } else if (mode === "forgot-password") {
      payload.email = email.trim();
    } else {
      payload.token = token;
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    }

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as AuthResponse;
      if (!response.ok) {
        if (result.code === "VALIDATION_ERROR" && result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setFormError(result.code ? authErrorMessages[result.code] : authErrorMessages.UNEXPECTED_ERROR);
        setPending(false);
        return;
      }

      if (mode === "sign-in") {
        router.push(resolveRedirect(redirectTo) ?? resolveRedirect(result.redirectTo) ?? "/dashboard");
        router.refresh();
        return;
      }

      const nextSuccessMessage = getSuccessMessage(result.successState);
      setSuccessMessage(nextSuccessMessage);
      setPending(false);
      if (mode === "sign-up") {
        setPassword("");
        setConfirmPassword("");
      }
    } catch {
      setFormError(authErrorMessages.UNEXPECTED_ERROR);
      setPending(false);
    }
  }

  function handleSocialSignIn(provider: "google" | "linkedin") {
    if (!oauthProviders[provider]) return;
    setProviderPending(provider);
    const next = resolveRedirect(redirectTo);
    window.location.href = `/api/auth/oauth/${provider}${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  }

  const showSocial = mode === "sign-in" || mode === "sign-up";
  const showPasswordGuidance = mode === "sign-up" || mode === "reset-password";

  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_80px_-48px_rgba(15,23,42,0.35)]">
      <div className="border-b border-amber-100 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_55%),linear-gradient(180deg,#fffdf7,#ffffff)] px-6 py-6 sm:px-8">
        <div className="inline-flex rounded-full border border-amber-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          Secure account access
        </div>
        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
          {mode === "sign-in"
            ? "Welcome back. Sign in to manage bookings, documents, and your dashboard."
            : mode === "sign-up"
              ? "Create your account to book sessions, submit documents, and track progress in one place."
              : mode === "forgot-password"
                ? "Enter your email and we'll send reset instructions if an account exists."
                : "Choose a strong new password for your account."}
        </p>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        {showSocial ? (
          <div className="space-y-3">
            <button
              type="button"
              disabled={!oauthProviders.google || pending || Boolean(providerPending)}
              onClick={() => handleSocialSignIn("google")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {providerPending === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
            <button
              type="button"
              disabled={!oauthProviders.linkedin || pending || Boolean(providerPending)}
              onClick={() => handleSocialSignIn("linkedin")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {providerPending === "linkedin" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkedInIcon />}
              Continue with LinkedIn
            </button>
            {!oauthProviders.google || !oauthProviders.linkedin ? (
              <p className="text-xs leading-6 text-slate-500">Social sign-in will become available once the provider credentials are configured for this environment.</p>
            ) : null}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">or continue with email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          </div>
        ) : null}

        {formError ? (
          <div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-none" />
            <p>{formError}</p>
          </div>
        ) : null}

        {successMessage ? (
          <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CircleCheckBig className="mt-0.5 h-5 w-5 flex-none" />
            <p>{successMessage}</p>
          </div>
        ) : null}

        {mode === "sign-up" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (fieldErrors.name) setInlineError("name", "");
              }}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
              placeholder="Aditi Rahegaonkar"
              autoComplete="name"
            />
            {fieldErrors.name ? <p className="text-sm text-rose-600">{fieldErrors.name}</p> : null}
          </label>
        ) : null}

        {mode !== "reset-password" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email address</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) setInlineError("email", "");
              }}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {fieldErrors.email ? <p className="text-sm text-rose-600">{fieldErrors.email}</p> : null}
          </label>
        ) : null}

        {mode !== "forgot-password" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">{mode === "reset-password" ? "New password" : "Password"}</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) setInlineError("password", "");
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                placeholder={mode === "sign-in" ? "Enter your password" : "Create a strong password"}
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password ? <p className="text-sm text-rose-600">{fieldErrors.password}</p> : null}
          </label>
        ) : null}

        {mode === "sign-up" || mode === "reset-password" ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Confirm password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (fieldErrors.confirmPassword) setInlineError("confirmPassword", "");
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
                aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.confirmPassword ? <p className="text-sm text-rose-600">{fieldErrors.confirmPassword}</p> : null}
          </label>
        ) : null}

        {showPasswordGuidance ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">Password requirements</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {passwordChecks.map((rule) => (
                <li key={rule.label} className={rule.valid ? "text-emerald-700" : "text-slate-600"}>
                  {rule.valid ? "✓" : "•"} {rule.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {mode === "sign-in" ? (
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-slate-700 hover:text-slate-950">
              Forgot password?
            </Link>
          </div>
        ) : null}

        {mode === "sign-up" ? (
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => {
                setAcceptTerms(event.target.checked);
                if (fieldErrors.acceptTerms) setInlineError("acceptTerms", "");
              }}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
            />
            <span>
              I agree to the <Link href="/terms-and-conditions" className="font-medium text-slate-900 underline underline-offset-2">Terms and Conditions</Link> and <Link href="/privacy-policy" className="font-medium text-slate-900 underline underline-offset-2">Privacy Policy</Link>.
            </span>
          </label>
        ) : null}

        {fieldErrors.acceptTerms ? <p className="text-sm text-rose-600">{fieldErrors.acceptTerms}</p> : null}

        <Button type="submit" disabled={pending || Boolean(providerPending)} className="w-full justify-center">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "sign-in"
                ? "Signing in..."
                : mode === "sign-up"
                  ? "Creating your account..."
                  : mode === "forgot-password"
                    ? "Sending reset instructions..."
                    : "Updating password..."}
            </>
          ) : mode === "sign-in" ? (
            "Sign in"
          ) : mode === "sign-up" ? (
            "Create account"
          ) : mode === "forgot-password" ? (
            "Send reset instructions"
          ) : (
            "Reset password"
          )}
        </Button>

        {mode === "reset-password" && !token ? (
          <p className="text-sm text-rose-600">This reset link is missing a token. Please request a new password reset email.</p>
        ) : null}

        {mode === "sign-in" && showDemoHint ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-800">
            Demo accounts are available in mock mode: <strong>student@example.com</strong>, <strong>coach@careergrowthstudio.co.uk</strong>, or <strong>admin@careergrowthstudio.co.uk</strong> with password <strong>Password123!</strong>
          </div>
        ) : null}
      </div>
    </form>
  );
}
