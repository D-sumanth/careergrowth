import type { AuthErrorCode } from "@/lib/auth/errors";

export function mapAuthSearchError(value?: string | null): AuthErrorCode | null {
  switch (value) {
    case "provider_unavailable":
    case "oauth_provider_error":
    case "oauth_state_invalid":
      return "OAUTH_PROVIDER_ERROR";
    case "oauth_account_conflict":
      return "OAUTH_ACCOUNT_CONFLICT";
    default:
      return null;
  }
}
