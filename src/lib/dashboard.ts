import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";

export async function getDashboardOverview(userId: string) {
  if (isMockMode() || !prisma) {
    return {
      upcomingBookings: [],
      pastBookings: [],
      documents: [],
      notifications: [],
      reviewRequests: [],
    };
  }

  const now = new Date();
  const [upcomingBookings, pastBookings, documents, notifications, reviewRequests] = await Promise.all([
    prisma.booking.findMany({
      where: { studentId: userId, startsAt: { gte: now } },
      include: { service: true },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { studentId: userId, startsAt: { lt: now } },
      include: { service: true },
      orderBy: { startsAt: "desc" },
      take: 5,
    }),
    prisma.uploadedDocument.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.resumeReviewRequest.findMany({
      where: { requesterId: userId },
      include: {
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { upcomingBookings, pastBookings, documents, notifications, reviewRequests };
}
