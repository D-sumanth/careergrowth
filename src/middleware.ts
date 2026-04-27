import { NextResponse, type NextRequest } from "next/server";
import { ATTRIBUTION_COOKIE, buildAttributionSnapshot } from "@/lib/marketing/attribution";

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

export function middleware(request: NextRequest) {
  if (shouldSkip(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const hasUtm =
    request.nextUrl.searchParams.has("utm_source") ||
    request.nextUrl.searchParams.has("utm_medium") ||
    request.nextUrl.searchParams.has("utm_campaign");
  const existing = request.cookies.get(ATTRIBUTION_COOKIE)?.value;

  if (!existing || hasUtm) {
    const response = NextResponse.next();
    const snapshot = buildAttributionSnapshot(request.nextUrl, request.headers.get("referer"));
    response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(snapshot), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

