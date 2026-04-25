import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { RateLimitError } from "@/lib/rate-limit";

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "EMAIL_NOT_VERIFIED"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "OAUTH_PROVIDER_ERROR"
  | "OAUTH_ACCOUNT_CONFLICT"
  | "PASSWORD_RESET_INVALID"
  | "PASSWORD_RESET_EXPIRED"
  | "TERMS_REQUIRED"
  | "UNEXPECTED_ERROR";

export type AuthErrorPayload = {
  ok: false;
  code: AuthErrorCode;
  fieldErrors?: Record<string, string>;
};

export class AuthFlowError extends Error {
  constructor(
    public code: AuthErrorCode,
    public status = 400,
    public fieldErrors?: Record<string, string>,
  ) {
    super(code);
  }
}

export function authOk(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function authError(code: AuthErrorCode, status = 400, fieldErrors?: Record<string, string>) {
  const payload: AuthErrorPayload = { ok: false, code, ...(fieldErrors ? { fieldErrors } : {}) };
  return NextResponse.json(payload, { status });
}

export function authErrorFromException(error: unknown) {
  if (error instanceof AuthFlowError) {
    return authError(error.code, error.status, error.fieldErrors);
  }

  if (error instanceof RateLimitError) {
    return authError("RATE_LIMITED", 429);
  }

  if (error instanceof ZodError) {
    const fieldErrors = error.issues.reduce<Record<string, string>>((acc, issue) => {
      const key = typeof issue.path[0] === "string" ? issue.path[0] : "form";
      if (!acc[key]) {
        acc[key] = issue.message;
      }
      return acc;
    }, {});
    return authError("VALIDATION_ERROR", 400, fieldErrors);
  }

  return authError("UNEXPECTED_ERROR", 500);
}

export const authErrorMessages: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
  EMAIL_ALREADY_EXISTS: "An account with that email already exists. Try signing in instead.",
  EMAIL_NOT_VERIFIED: "Your account has not been verified yet. Please check your email.",
  RATE_LIMITED: "Too many attempts. Please try again later.",
  VALIDATION_ERROR: "Please check the highlighted fields and try again.",
  OAUTH_PROVIDER_ERROR: "We couldn't complete that social sign-in right now. Please try again or use email.",
  OAUTH_ACCOUNT_CONFLICT: "That social account matches an existing account that can't be linked automatically. Please sign in with email first.",
  PASSWORD_RESET_INVALID: "That reset link is invalid. Please request a new one.",
  PASSWORD_RESET_EXPIRED: "That reset link has expired. Please request a new one.",
  TERMS_REQUIRED: "Please accept the Terms and Privacy Policy to continue.",
  UNEXPECTED_ERROR: "Something went wrong. Please try again in a moment.",
};
