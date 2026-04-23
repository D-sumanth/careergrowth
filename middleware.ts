import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!needsAuth) return NextResponse.next();

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
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
