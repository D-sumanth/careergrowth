import { UserRole } from "@prisma/client";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";

function parseDateInLondon(date: string, time = "00:00:00") {
  return fromZonedTime(`${date}T${time}`, "Europe/London");
}

export async function getAvailabilityManagerData(currentUserId: string, role: "CONSULTANT" | "ADMIN") {
  if (isMockMode() || !prisma) {
    const defaultConsultantId = role === "CONSULTANT" ? currentUserId : "mock-consultant";

    return {
      consultants: [
        {
          id: defaultConsultantId,
          name: role === "CONSULTANT" ? "Consultant" : "Aditi Rahegaonkar",
          email: role === "CONSULTANT" ? "consultant@example.com" : "coach@careergrowthstudio.co.uk",
        },
      ],
      selectedConsultantId: defaultConsultantId,
      rules: [],
      overrides: [],
    };
  }

  const consultants = await prisma.user.findMany({
    where: role === "ADMIN" ? { role: UserRole.CONSULTANT, isActive: true } : { id: currentUserId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  const selectedConsultantId = role === "ADMIN" ? consultants[0]?.id ?? null : currentUserId;
  if (!selectedConsultantId) {
    return {
      consultants: [],
      selectedConsultantId: null,
      rules: [],
      overrides: [],
    };
  }

  const [rules, overrides] = await Promise.all([
    prisma.availabilityRule.findMany({
      where: { consultantId: selectedConsultantId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.availabilityOverride.findMany({
      where: {
        consultantId: selectedConsultantId,
        date: { gte: parseDateInLondon(new Date().toISOString().slice(0, 10)) },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 20,
    }),
  ]);

  return {
    consultants,
    selectedConsultantId,
    rules,
    overrides,
  };
}

export async function createAvailabilityRule(input: {
  consultantId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}) {
  if (isMockMode() || !prisma) {
    return {
      id: `mock-rule-${Date.now()}`,
      ...input,
      timezone: "Europe/London",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return prisma.availabilityRule.create({
    data: {
      consultantId: input.consultantId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      timezone: "Europe/London",
      isActive: true,
    },
  });
}

export async function createAvailabilityOverride(input: {
  consultantId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAvailable: boolean;
  reason?: string;
}) {
  if (isMockMode() || !prisma) {
    return {
      id: `mock-override-${Date.now()}`,
      consultantId: input.consultantId,
      date: parseDateInLondon(input.date),
      startTime: input.startTime ?? null,
      endTime: input.endTime ?? null,
      isAvailable: input.isAvailable,
      reason: input.reason ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return prisma.availabilityOverride.create({
    data: {
      consultantId: input.consultantId,
      date: parseDateInLondon(input.date),
      startTime: input.startTime ?? null,
      endTime: input.endTime ?? null,
      isAvailable: input.isAvailable,
      reason: input.reason ?? null,
    },
  });
}

export async function deleteAvailabilityEntry(input: {
  id: string;
  kind: "rule" | "override";
  actorRole: "CONSULTANT" | "ADMIN";
  actorUserId: string;
}) {
  if (isMockMode() || !prisma) return { ok: true };

  if (input.kind === "rule") {
    if (input.actorRole === "ADMIN") {
      await prisma.availabilityRule.delete({ where: { id: input.id } });
    } else {
      const result = await prisma.availabilityRule.deleteMany({
        where: { id: input.id, consultantId: input.actorUserId },
      });
      if (!result.count) throw new Error("Availability entry not found.");
    }
  } else {
    if (input.actorRole === "ADMIN") {
      await prisma.availabilityOverride.delete({ where: { id: input.id } });
    } else {
      const result = await prisma.availabilityOverride.deleteMany({
        where: { id: input.id, consultantId: input.actorUserId },
      });
      if (!result.count) throw new Error("Availability entry not found.");
    }
  }

  return { ok: true };
}
