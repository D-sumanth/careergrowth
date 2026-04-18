import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isMockMode } from "@/lib/env";

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

export async function authenticateUser(email: string, password: string) {
  if (isMockMode() || !prisma) {
    const user = mockUsers.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) return null;
    return { userId: user.id, email: user.email, name: user.name, role: user.role };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) return null;

  return { userId: user.id, email: user.email, name: user.name, role: user.role };
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  if (isMockMode() || !prisma) {
    return {
      userId: `mock-${Date.now()}`,
      email: input.email,
      name: input.name,
      role: "STUDENT" as const,
      mock: true,
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.STUDENT,
    },
  });

  return { userId: user.id, email: user.email, name: user.name, role: user.role, mock: false };
}
