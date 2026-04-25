import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { env, isMockMode } from "@/lib/env";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AuthFlowError } from "@/lib/auth/errors";
import { createPlainToken, hashToken } from "@/lib/auth/tokens";
import { sendTransactionalEmail } from "@/lib/email";
import { writeAuditLog } from "@/lib/auth/audit";

const mockUsers = [
  {
    id: "mock-admin",
    name: "Admin User",
    email: "admin@careergrowthstudio.co.uk",
    password: "Password123!",
    role: "ADMIN" as const,
  },
  {
    id: "mock-consultant",
    name: "Priya Shah",
    email: "coach@careergrowthstudio.co.uk",
    password: "Password123!",
    role: "CONSULTANT" as const,
  },
  {
    id: "mock-student",
    name: "Arjun Patel",
    email: "student@example.com",
    password: "Password123!",
    role: "STUDENT" as const,
  },
];

type SessionUser = { userId: string; email: string; name: string; role: "STUDENT" | "CONSULTANT" | "ADMIN" };

function buildVerificationLink(token: string) {
  return `${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
}

function buildResetLink(token: string) {
  return `${env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function authenticateUser(email: string, password: string): Promise<
  | { status: "success"; user: SessionUser }
  | { status: "invalid" }
  | { status: "unverified" }
> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isMockMode() || !prisma) {
    const user = mockUsers.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);
    if (!user || user.password !== password) return { status: "invalid" };
    return {
      status: "success",
      user: { userId: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return { status: "invalid" };

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) return { status: "invalid" };
  if (!user.emailVerifiedAt) return { status: "unverified" };

  return {
    status: "success",
    user: { userId: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();

  if (isMockMode() || !prisma) {
    return {
      userId: `mock-${Date.now()}`,
      email: normalizedEmail,
      name: input.name,
      role: "STUDENT" as const,
      mock: true,
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new AuthFlowError("EMAIL_ALREADY_EXISTS", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: normalizedEmail,
      passwordHash,
      role: UserRole.STUDENT,
    },
  });

  await issueEmailVerification(user.id, user.email, user.name);
  await writeAuditLog({
    actorId: user.id,
    action: "auth.account_created",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email },
  });

  return { userId: user.id, email: user.email, name: user.name, role: user.role, mock: false };
}

export async function issueEmailVerification(userId: string, email: string, name: string) {
  if (!prisma) return null;

  await prisma.emailVerificationToken.updateMany({
    where: { userId, verifiedAt: null },
    data: { expiresAt: new Date() },
  });

  const plainToken = createPlainToken();
  const tokenHash = hashToken(plainToken);
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const link = buildVerificationLink(plainToken);
  await sendTransactionalEmail({
    to: email,
    subject: "Verify your Career Growth Studio account",
    html: `<p>Hi ${name},</p><p>Please verify your account to activate bookings, workshops, and document delivery.</p><p><a href="${link}">Verify your email address</a></p><p>If you did not create this account, you can ignore this email.</p>`,
  });

  return { link };
}

export async function verifyEmailAddress(token: string) {
  if (isMockMode() || !prisma) {
    return { status: "verified" as const };
  }

  const tokenHash = hashToken(token);
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!verificationToken || verificationToken.verifiedAt) {
    return { status: "invalid" as const };
  }

  if (verificationToken.expiresAt < new Date()) {
    return { status: "expired" as const };
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { verifiedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerifiedAt: verificationToken.user.emailVerifiedAt ?? new Date() },
    }),
  ]);

  await writeAuditLog({
    actorId: verificationToken.userId,
    action: "auth.email_verified",
    entityType: "User",
    entityId: verificationToken.userId,
  });

  return { status: "verified" as const, email: verificationToken.user.email };
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (isMockMode() || !prisma) {
    return { ok: true as const };
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return { ok: true as const };
  }

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { expiresAt: new Date() },
  });

  const plainToken = createPlainToken();
  const tokenHash = hashToken(plainToken);
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  await sendTransactionalEmail({
    to: user.email,
    subject: "Reset your Career Growth Studio password",
    html: `<p>Hi ${user.name},</p><p>We received a request to reset your password.</p><p><a href="${buildResetLink(plainToken)}">Create a new password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });

  await writeAuditLog({
    actorId: user.id,
    action: "auth.password_reset_requested",
    entityType: "User",
    entityId: user.id,
  });

  return { ok: true as const };
}

export async function resetPasswordWithToken(token: string, password: string) {
  if (isMockMode() || !prisma) {
    return { status: "reset" as const };
  }

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt) {
    throw new AuthFlowError("PASSWORD_RESET_INVALID", 400);
  }

  if (resetToken.expiresAt < new Date()) {
    throw new AuthFlowError("PASSWORD_RESET_EXPIRED", 400);
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
  ]);

  await writeAuditLog({
    actorId: resetToken.userId,
    action: "auth.password_reset_completed",
    entityType: "User",
    entityId: resetToken.userId,
  });

  return { status: "reset" as const, email: resetToken.user.email };
}
