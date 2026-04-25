import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { setSessionCookie } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/auth/audit";

export type OAuthProvider = "google" | "linkedin";

type ProviderConfig = {
  provider: OAuthProvider;
  label: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
  clientId?: string;
  clientSecret?: string;
};

type OAuthIdentity = {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl?: string | null;
};

const OAUTH_STATE_COOKIE = "career_oauth_state";

export function getOAuthProvider(provider: OAuthProvider): ProviderConfig {
  return provider === "google"
    ? {
        provider,
        label: "Google",
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
        scope: "openid email profile",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }
    : {
        provider,
        label: "LinkedIn",
        authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
        tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        userInfoUrl: "https://api.linkedin.com/v2/userinfo",
        scope: "openid profile email",
        clientId: env.LINKEDIN_CLIENT_ID,
        clientSecret: env.LINKEDIN_CLIENT_SECRET,
      };
}

export function isOAuthProviderConfigured(provider: OAuthProvider) {
  const config = getOAuthProvider(provider);
  return Boolean(config.clientId && config.clientSecret);
}

function buildCallbackUrl(provider: OAuthProvider) {
  return `${env.APP_URL}/api/auth/oauth/${provider}/callback`;
}

function createState() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function beginOAuthFlow(provider: OAuthProvider, nextPath?: string | null) {
  const config = getOAuthProvider(provider);
  if (!config.clientId || !config.clientSecret) {
    return NextResponse.redirect(new URL(`/sign-in?oauth=${provider}&error=provider_unavailable`, env.APP_URL));
  }

  const state = createState();
  const safeNext = nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard";
  const cookieStore = await cookies();
  cookieStore.set(
    OAUTH_STATE_COOKIE,
    JSON.stringify({
      state,
      provider,
      next: safeNext,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    },
  );

  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", buildCallbackUrl(provider));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "consent");
  return NextResponse.redirect(url);
}

async function readOAuthState(expectedProvider: OAuthProvider, state: string) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      state: string;
      provider: OAuthProvider;
      next: string;
      expiresAt: number;
    };

    if (parsed.provider !== expectedProvider || parsed.state !== state || parsed.expiresAt < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function exchangeCodeForAccessToken(provider: OAuthProvider, code: string) {
  const config = getOAuthProvider(provider);
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Missing OAuth provider configuration.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: buildCallbackUrl(provider),
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Token exchange failed.");
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Provider did not return an access token.");
  }

  return json.access_token;
}

async function fetchOAuthIdentity(provider: OAuthProvider, accessToken: string): Promise<OAuthIdentity> {
  const config = getOAuthProvider(provider);
  const response = await fetch(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch provider profile.");
  }

  const json = (await response.json()) as Record<string, unknown>;
  if (provider === "google") {
    return {
      providerAccountId: String(json.sub ?? ""),
      email: String(json.email ?? "").toLowerCase(),
      emailVerified: Boolean(json.email_verified),
      name: String(json.name ?? json.email ?? "New member"),
      avatarUrl: typeof json.picture === "string" ? json.picture : null,
    };
  }

  return {
    providerAccountId: String(json.sub ?? json.id ?? ""),
    email: String(json.email ?? "").toLowerCase(),
    emailVerified: true,
    name: String(json.name ?? json.given_name ?? json.email ?? "New member"),
    avatarUrl: typeof json.picture === "string" ? json.picture : null,
  };
}

export async function completeOAuthFlow(provider: OAuthProvider, code: string, state: string) {
  const oauthState = await readOAuthState(provider, state);
  if (!oauthState) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth_state_invalid", env.APP_URL));
  }

  try {
    const accessToken = await exchangeCodeForAccessToken(provider, code);
    const identity = await fetchOAuthIdentity(provider, accessToken);

    if (!identity.email || !identity.providerAccountId) {
      throw new Error("Provider identity is incomplete.");
    }

    if (!prisma) {
      await setSessionCookie({
        userId: `${provider}-${identity.providerAccountId}`,
        email: identity.email,
        name: identity.name,
        role: "STUDENT",
      });
      return NextResponse.redirect(new URL(oauthState.next, env.APP_URL));
    }

    const existingAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: identity.providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = existingAccount?.user ?? null;

    if (!user) {
      const existingUser = await prisma.user.findUnique({ where: { email: identity.email } });
      if (existingUser) {
        if (!identity.emailVerified) {
          return NextResponse.redirect(new URL("/sign-in?error=oauth_account_conflict", env.APP_URL));
        }

        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerifiedAt: existingUser.emailVerifiedAt ?? new Date(),
            image: existingUser.image ?? identity.avatarUrl ?? undefined,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            name: identity.name,
            email: identity.email,
            emailVerifiedAt: new Date(),
            image: identity.avatarUrl ?? undefined,
          },
        });
      }

      await prisma.oAuthAccount.create({
        data: {
          provider,
          providerAccountId: identity.providerAccountId,
          email: identity.email,
          userId: user.id,
        },
      });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await writeAuditLog({
      actorId: user.id,
      action: "auth.oauth_sign_in_success",
      entityType: "User",
      entityId: user.id,
      metadata: { provider },
    });

    return NextResponse.redirect(new URL(oauthState.next || (user.role === "ADMIN" ? "/admin" : "/dashboard"), env.APP_URL));
  } catch {
    await writeAuditLog({
      action: "auth.oauth_sign_in_failure",
      entityType: "OAuthProvider",
      entityId: provider,
      metadata: { provider },
    });
    return NextResponse.redirect(new URL("/sign-in?error=oauth_provider_error", env.APP_URL));
  }
}
