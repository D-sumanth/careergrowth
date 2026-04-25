import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export type AppRole = "VISITOR" | "STUDENT" | "CONSULTANT" | "ADMIN";

export type AppSession = {
  userId: string;
  email: string;
  name: string;
  role: Exclude<AppRole, "VISITOR">;
};

const SESSION_COOKIE = "career_console_session";
const encoder = new TextEncoder();

export async function createSessionToken(session: AppSession, rememberMe = false) {
  const sessionDurationDays = rememberMe ? Math.max(env.SESSION_DURATION_DAYS, 30) : env.SESSION_DURATION_DAYS;
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionDurationDays}d`)
    .sign(encoder.encode(env.AUTH_SECRET));
}

export async function setSessionCookie(session: AppSession, options?: { rememberMe?: boolean }) {
  const rememberMe = options?.rememberMe ?? false;
  const token = await createSessionToken(session, rememberMe);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * Math.max(env.SESSION_DURATION_DAYS, 30) } : {}),
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const result = await jwtVerify<AppSession>(token, encoder.encode(env.AUTH_SECRET));
    return result.payload;
  } catch {
    return null;
  }
}

export async function requireSession(roles?: Exclude<AppRole, "VISITOR">[]) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  if (roles && !roles.includes(session.role)) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return session;
}
