import { NextRequest } from "next/server";
import { completeOAuthFlow, type OAuthProvider } from "@/lib/auth/oauth";
import { assertRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  assertRateLimit(`oauth-callback:${provider}:${request.headers.get("x-forwarded-for") ?? "local"}`, 20, 60_000);

  if (provider !== "google" && provider !== "linkedin") {
    return Response.redirect(new URL("/sign-in?error=oauth_provider_error", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state) {
    return Response.redirect(new URL("/sign-in?error=oauth_provider_error", request.url));
  }

  return completeOAuthFlow(provider as OAuthProvider, code, state);
}
