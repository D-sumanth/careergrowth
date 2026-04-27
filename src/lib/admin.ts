import { InquiryStatus, PaymentStatus, ReviewStatus, UserRole, WorkshopStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";

function sumRevenue(amounts: Array<{ amountPence: number }>) {
  return amounts.reduce((total, item) => total + item.amountPence, 0);
}

function groupSources(items: Array<{ source: string | null }>) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = item.source?.trim() || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getAdminOverviewData() {
  if (isMockMode() || !prisma) {
    return {
      totalUsers: 0,
      totalBookings: 0,
      revenuePence: 0,
      pendingReviews: 0,
      upcomingSessions: [],
      recentPayments: [],
      recentInquiries: [],
    };
  }

  const now = new Date();
  const [totalUsers, totalBookings, successfulPayments, pendingReviews, upcomingSessions, recentPayments, recentInquiries] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCEEDED },
        select: { amountPence: true },
      }),
      prisma.resumeReviewRequest.count({
        where: { status: { in: [ReviewStatus.NEW, ReviewStatus.IN_PROGRESS, ReviewStatus.AWAITING_CLIENT] } },
      }),
      prisma.booking.findMany({
        where: { startsAt: { gte: now } },
        include: { student: true, service: true, consultant: true },
        orderBy: { startsAt: "asc" },
        take: 5,
      }),
      prisma.payment.findMany({
        include: { user: true, booking: { include: { service: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    totalUsers,
    totalBookings,
    revenuePence: sumRevenue(successfulPayments),
    pendingReviews,
    upcomingSessions,
    recentPayments,
    recentInquiries,
  };
}

export async function getAdminUsersData() {
  if (isMockMode() || !prisma) {
    return { totalUsers: 0, users: [] };
  }

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: { select: { bookings: true, uploadedDocuments: true, notifications: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return { totalUsers: users.length, users };
}

export async function getAdminBookingsData() {
  if (isMockMode() || !prisma) {
    return { bookings: [], upcomingCount: 0 };
  }

  const now = new Date();
  const bookings = await prisma.booking.findMany({
    include: { student: true, consultant: true, service: true },
    orderBy: { startsAt: "desc" },
    take: 50,
  });

  return {
    bookings,
    upcomingCount: bookings.filter((booking) => booking.startsAt >= now).length,
  };
}

export async function getAdminServicesData() {
  if (isMockMode() || !prisma) {
    return { services: [] };
  }

  const services = await prisma.service.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
  });

  return { services };
}

export async function getAdminWorkshopsData() {
  if (isMockMode() || !prisma) {
    return { workshops: [] };
  }

  const workshops = await prisma.workshop.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { startsAt: "desc" },
  });

  return { workshops };
}

export async function getAdminContentData() {
  if (isMockMode() || !prisma) {
    return { posts: [], faqs: [], testimonials: [], siteSettings: [] };
  }

  const [posts, faqs, testimonials, siteSettings] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: 20 }),
    prisma.fAQ.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }], take: 20 }),
    prisma.testimonial.findMany({ orderBy: { publishedAt: "desc" }, take: 20 }),
    prisma.siteSetting.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
  ]);

  return { posts, faqs, testimonials, siteSettings };
}

export async function getAdminInquiriesData() {
  if (isMockMode() || !prisma) {
    return { inquiries: [], openCount: 0 };
  }

  const inquiries = await prisma.inquiry.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return {
    inquiries,
    openCount: inquiries.filter((inquiry) => inquiry.status !== InquiryStatus.CLOSED).length,
  };
}

export async function getAdminCrmData() {
  if (isMockMode() || !prisma) {
    return {
      openInquiries: 0,
      dueFollowUps: 0,
      recentUsers: [],
      recentInquiries: [],
      sourceBreakdown: [],
    };
  }

  const now = new Date();
  const [recentUsers, recentInquiries] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        acquisitionSource: true,
        acquisitionMedium: true,
        acquisitionCampaign: true,
      },
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        category: true,
        status: true,
        source: true,
        medium: true,
        campaign: true,
        assignedTo: true,
        internalNotes: true,
        followUpAt: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    openInquiries: recentInquiries.filter((item) => item.status !== InquiryStatus.CLOSED).length,
    dueFollowUps: recentInquiries.filter((item) => item.followUpAt && item.followUpAt <= now && item.status !== InquiryStatus.CLOSED).length,
    recentUsers,
    recentInquiries,
    sourceBreakdown: groupSources([
      ...recentUsers.map((user) => ({ source: user.acquisitionSource })),
      ...recentInquiries.map((inquiry) => ({ source: inquiry.source })),
    ]),
  };
}

export async function getAdminAnalyticsData() {
  if (isMockMode() || !prisma) {
    return {
      totalUsers: 0,
      totalInquiries: 0,
      totalSubscribers: 0,
      totalBookings: 0,
      paidBookings: 0,
      sourceBreakdown: [],
      subscriberSources: [],
      monthlyFunnel: [],
    };
  }

  const [users, inquiries, subscribers, bookings] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, createdAt: true, acquisitionSource: true },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
    prisma.inquiry.findMany({
      select: { id: true, createdAt: true, source: true, status: true },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
    prisma.newsletterSubscriber.findMany({
      select: { id: true, createdAt: true, source: true },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
    prisma.booking.findMany({
      select: { id: true, createdAt: true, paymentStatus: true },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
  ]);

  const monthlyLabels = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  const monthlyFunnel = monthlyLabels.map((label) => ({
    label,
    inquiries: inquiries.filter((item) => item.createdAt.toISOString().slice(0, 7) === label).length,
    signUps: users.filter((item) => item.createdAt.toISOString().slice(0, 7) === label).length,
    bookings: bookings.filter((item) => item.createdAt.toISOString().slice(0, 7) === label).length,
  }));

  return {
    totalUsers: users.length,
    totalInquiries: inquiries.length,
    totalSubscribers: subscribers.length,
    totalBookings: bookings.length,
    paidBookings: bookings.filter((item) => item.paymentStatus === PaymentStatus.SUCCEEDED).length,
    sourceBreakdown: groupSources([
      ...users.map((user) => ({ source: user.acquisitionSource })),
      ...inquiries.map((inquiry) => ({ source: inquiry.source })),
    ]),
    subscriberSources: groupSources(subscribers),
    monthlyFunnel,
  };
}

export async function getAdminReviewsData() {
  if (isMockMode() || !prisma) {
    return { reviews: [], pendingCount: 0, assignees: [] };
  }

  const [reviews, assignees] = await Promise.all([
    prisma.resumeReviewRequest.findMany({
      include: { requester: true, assignedTo: true, documents: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.user.findMany({
      where: { role: { in: [UserRole.ADMIN, UserRole.CONSULTANT] }, isActive: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    }),
  ]);

  return {
    reviews,
    pendingCount: reviews.filter((review) => review.status !== ReviewStatus.DELIVERED && review.status !== ReviewStatus.COMPLETED).length,
    assignees,
  };
}

export async function getAdminPaymentsData() {
  if (isMockMode() || !prisma) {
    return { payments: [], revenuePence: 0 };
  }

  const payments = await prisma.payment.findMany({
    include: { user: true, booking: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return {
    payments,
    revenuePence: sumRevenue(payments.filter((payment) => payment.status === PaymentStatus.SUCCEEDED)),
  };
}

export function getRoleLabel(role: UserRole) {
  return role.replaceAll("_", " ");
}

export function getWorkshopStatusLabel(status: WorkshopStatus) {
  return status.replaceAll("_", " ");
}
