import { PrismaClient } from "@prisma/client";
import { env, isMockMode } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  !isMockMode() && env.DATABASE_URL
    ? globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null;

if (prisma && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
