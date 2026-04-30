import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { ATTRIBUTION_COOKIE, buildAttributionSnapshot } from "@/lib/marketing/attribution";

const protectedRoutes = ["/dashboard", "/admin"];

function shouldSkip(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".")
  );
}

async function enforceRouteAccess(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!needsAuth) return null;

  const signInUrl = new URL("/sign-in", request.url);
  const intendedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  signInUrl.searchParams.set("next", intendedPath);

  const token = request.cookies.get("career_console_session")?.value;
  if (!token) {
    return NextResponse.redirect(signInUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-auth-secret-change-me");
    const result = await jwtVerify<{ role: string }>(token, secret);
    if (pathname.startsWith("/admin") && result.payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return null;
  } catch {
    return NextResponse.redirect(signInUrl);
  }
}

function addAttributionCookie(request: NextRequest, response: NextResponse) {
  if (shouldSkip(request.nextUrl.pathname)) {
    return response;
  }

  const hasUtm =
    request.nextUrl.searchParams.has("utm_source") ||
    request.nextUrl.searchParams.has("utm_medium") ||
    request.nextUrl.searchParams.has("utm_campaign");
  const existing = request.cookies.get(ATTRIBUTION_COOKIE)?.value;

  if (!existing || hasUtm) {
    const snapshot = buildAttributionSnapshot(request.nextUrl, request.headers.get("referer"));
    response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(snapshot), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const accessResponse = await enforceRouteAccess(request);
  if (accessResponse) {
    return accessResponse;
  }

  return addAttributionCookie(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
