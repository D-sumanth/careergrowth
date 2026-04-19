import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function getCurrentUserAccount(userId: string) {
  if (isMockMode() || !prisma) {
    return {
      id: userId,
      name: userId === "mock-consultant" ? "Priya Shah" : userId === "mock-admin" ? "Admin User" : "Arjun Patel",
      email:
        userId === "mock-consultant"
          ? "coach@careergrowthstudio.co.uk"
          : userId === "mock-admin"
            ? "admin@careergrowthstudio.co.uk"
            : "student@example.com",
      role: userId === "mock-consultant" ? "CONSULTANT" : userId === "mock-admin" ? "ADMIN" : "STUDENT",
      profile: {
        mobileNumber: null,
        university: "University of Birmingham",
        degree: "MSc Management",
        visaStatus: "Graduate visa",
        careerTarget: "Graduate Analyst",
        linkedInUrl: null,
        timezone: "Europe/London",
        notes: null,
      },
    };
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

export async function updateCurrentUserAccount(
  userId: string,
  input: {
    name: string;
    mobileNumber?: string | null;
    university?: string | null;
    degree?: string | null;
    visaStatus?: string | null;
    careerTarget?: string | null;
    linkedInUrl?: string | null;
    timezone?: string | null;
    notes?: string | null;
  },
) {
  if (isMockMode() || !prisma) {
    return {
      id: userId,
      name: input.name,
      email: userId === "mock-consultant" ? "coach@careergrowthstudio.co.uk" : userId === "mock-admin" ? "admin@careergrowthstudio.co.uk" : "student@example.com",
      role: userId === "mock-consultant" ? "CONSULTANT" : userId === "mock-admin" ? "ADMIN" : "STUDENT",
      profile: {
        mobileNumber: input.mobileNumber ?? null,
        university: input.university ?? null,
        degree: input.degree ?? null,
        visaStatus: input.visaStatus ?? null,
        careerTarget: input.careerTarget ?? null,
        linkedInUrl: input.linkedInUrl ?? null,
        timezone: input.timezone ?? "Europe/London",
        notes: input.notes ?? null,
      },
    };
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      profile: {
        upsert: {
          create: {
            mobileNumber: input.mobileNumber ?? null,
            university: input.university ?? null,
            degree: input.degree ?? null,
            visaStatus: input.visaStatus ?? null,
            careerTarget: input.careerTarget ?? null,
            linkedInUrl: input.linkedInUrl ?? null,
            timezone: input.timezone ?? "Europe/London",
            notes: input.notes ?? null,
          },
          update: {
            mobileNumber: input.mobileNumber ?? null,
            university: input.university ?? null,
            degree: input.degree ?? null,
            visaStatus: input.visaStatus ?? null,
            careerTarget: input.careerTarget ?? null,
            linkedInUrl: input.linkedInUrl ?? null,
            timezone: input.timezone ?? "Europe/London",
            notes: input.notes ?? null,
          },
        },
      },
    },
    include: { profile: true },
  });
}

export async function changeCurrentUserPassword(userId: string, currentPassword: string, newPassword: string) {
  if (isMockMode() || !prisma) {
    if (currentPassword !== "Password123!") {
      throw new Error("Current password is incorrect.");
    }
    return { ok: true };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");
  const passwordOk = await verifyPassword(currentPassword, user.passwordHash);
  if (!passwordOk) throw new Error("Current password is incorrect.");

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return { ok: true };
}

export async function listCurrentUserDocuments(userId: string) {
  if (isMockMode() || !prisma) {
    return [];
  }

  return prisma.uploadedDocument.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveUploadedDocumentForUser(
  userId: string,
  input: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
  },
) {
  if (isMockMode() || !prisma) {
    return {
      id: `mock-doc-${Date.now()}`,
      ownerId: userId,
      ...input,
      createdAt: new Date(),
      visibility: "PRIVATE",
    };
  }

  return prisma.uploadedDocument.create({
    data: {
      ownerId: userId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      storageKey: input.storageKey,
      visibility: "PRIVATE",
    },
  });
}
