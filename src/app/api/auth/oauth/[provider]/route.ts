import { NextRequest } from "next/server";
import { beginOAuthFlow, type OAuthProvider } from "@/lib/auth/oauth";
import { assertRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  assertRateLimit(`oauth:${provider}:${request.headers.get("x-forwarded-for") ?? "local"}`, 10, 60_000);

  if (provider !== "google" && provider !== "linkedin") {
    return Response.redirect(new URL("/sign-in?error=oauth_provider_error", request.url));
  }

  const nextPath = request.nextUrl.searchParams.get("next");
  return beginOAuthFlow(provider as OAuthProvider, nextPath);
}
