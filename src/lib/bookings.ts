import { addMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { BookingStatus, PaymentStatus, UserRole } from "@prisma/client";
import { isMockMode } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { ensureBookableServiceBySlug } from "@/lib/services";

const scheduleTimezone = "Europe/London";

const defaultRules = [
  { dayOfWeek: 1, startTime: "10:00", endTime: "17:00" },
  { dayOfWeek: 2, startTime: "10:00", endTime: "17:00" },
  { dayOfWeek: 3, startTime: "10:00", endTime: "17:00" },
  { dayOfWeek: 4, startTime: "10:00", endTime: "17:00" },
  { dayOfWeek: 5, startTime: "10:00", endTime: "16:00" },
] as const;

function getDayBoundsUtc(date: string) {
  return {
    start: fromZonedTime(`${date}T00:00:00`, scheduleTimezone),
    end: fromZonedTime(`${date}T23:59:59.999`, scheduleTimezone),
  };
}

function getDayOfWeek(date: string) {
  const middayUtc = fromZonedTime(`${date}T12:00:00`, scheduleTimezone);
  return toZonedTime(middayUtc, scheduleTimezone).getDay();
}

function createUtcDate(date: string, time: string) {
  return fromZonedTime(`${date}T${time}:00`, scheduleTimezone);
}

async function getDefaultConsultantId() {
  if (isMockMode() || !prisma) return null;

  const consultant = await prisma.user.findFirst({
    where: { role: UserRole.CONSULTANT, isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  return consultant?.id ?? null;
}

async function getAvailabilityWindows(consultantId: string | null, date: string) {
  const dayOfWeek = getDayOfWeek(date);

  if (isMockMode() || !prisma) {
    return defaultRules.filter((rule) => rule.dayOfWeek === dayOfWeek);
  }

  const { start, end } = getDayBoundsUtc(date);
  const [rules, overrides] = await Promise.all([
    prisma.availabilityRule.findMany({
      where: {
        dayOfWeek,
        isActive: true,
        OR: consultantId ? [{ consultantId }, { consultantId: null }] : [{ consultantId: null }],
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.availabilityOverride.findMany({
      where: {
        date: { gte: start, lte: end },
        OR: consultantId ? [{ consultantId }, { consultantId: null }] : [{ consultantId: null }],
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  const blockingDay = overrides.some((override) => !override.isAvailable && !override.startTime && !override.endTime);
  if (blockingDay) return [];

  const positiveOverrides = overrides.filter((override) => override.isAvailable && override.startTime && override.endTime);
  if (positiveOverrides.length) {
    return positiveOverrides.map((override) => ({
      dayOfWeek,
      startTime: override.startTime as string,
      endTime: override.endTime as string,
    }));
  }

  if (rules.length) {
    return rules.map((rule) => ({
      dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
    }));
  }

  return defaultRules.filter((rule) => rule.dayOfWeek === dayOfWeek);
}

async function getExistingBookingsForDate(consultantId: string | null, date: string) {
  if (isMockMode() || !prisma) {
    return [];
  }

  const { start, end } = getDayBoundsUtc(date);
  return prisma.booking.findMany({
    where: {
      ...(consultantId ? { consultantId } : {}),
      startsAt: { gte: start, lte: end },
      status: { notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED, BookingStatus.NO_SHOW] },
    },
    orderBy: { startsAt: "asc" },
  });
}

function overlaps(start: Date, end: Date, booking: { startsAt: Date; endsAt: Date }) {
  return start < booking.endsAt && end > booking.startsAt;
}

export async function getAvailabilityForServiceDate(input: {
  serviceSlug: string;
  date: string;
  timezone: string;
}) {
  const service = await ensureBookableServiceBySlug(input.serviceSlug);
  if (!service || service.durationMinutes === null) {
    throw new Error("This service does not support calendar booking yet.");
  }

  const consultantId = await getDefaultConsultantId();
  const [windows, existingBookings] = await Promise.all([
    getAvailabilityWindows(consultantId, input.date),
    getExistingBookingsForDate(consultantId, input.date),
  ]);

  const activeBookings = existingBookings.filter((booking) => booking.status !== BookingStatus.CANCELLED);
  if (activeBookings.length >= service.maxBookingsPerDay) {
    return { timezone: input.timezone, slots: [] as string[] };
  }

  const slotStep = service.durationMinutes + service.sessionBufferMins;
  const slots: string[] = [];

  for (const window of windows) {
    let pointer = createUtcDate(input.date, window.startTime);
    const windowEnd = createUtcDate(input.date, window.endTime);

    while (addMinutes(pointer, service.durationMinutes) <= windowEnd) {
      const slotEnd = addMinutes(pointer, service.durationMinutes);
      const blocked = activeBookings.some((booking) => overlaps(pointer, slotEnd, booking));
      if (!blocked) {
        slots.push(pointer.toISOString());
      }
      pointer = addMinutes(pointer, slotStep);
    }
  }

  return {
    timezone: input.timezone,
    slots,
    service: {
      slug: service.slug,
      title: service.title,
      durationMinutes: service.durationMinutes,
      pricePence: service.pricePence,
    },
  };
}

export async function createBookingForCurrentUser(input: {
  userId: string;
  serviceSlug: string;
  startsAt: string;
  timezone: string;
  notes?: string;
}) {
  const service = await ensureBookableServiceBySlug(input.serviceSlug);
  if (!service || service.durationMinutes === null || !prisma) {
    throw new Error("This service does not support live booking yet.");
  }

  const startsAt = new Date(input.startsAt);
  const bookingDate = formatInTimeZone(startsAt, scheduleTimezone, "yyyy-MM-dd");
  const available = await getAvailabilityForServiceDate({
    serviceSlug: input.serviceSlug,
    date: bookingDate,
    timezone: input.timezone,
  });

  const matchingSlot = available.slots.find((slot) => new Date(slot).getTime() === startsAt.getTime());
  if (!matchingSlot) {
    throw new Error("That slot is no longer available. Please choose another time.");
  }

  const consultantId = await getDefaultConsultantId();
  const endsAt = addMinutes(startsAt, service.durationMinutes);

  return prisma.$transaction(async (tx) => {
    const dayBounds = getDayBoundsUtc(bookingDate);
    const dayBookings = await tx.booking.findMany({
      where: {
        ...(consultantId ? { consultantId } : {}),
        startsAt: { gte: dayBounds.start, lte: dayBounds.end },
        status: { notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED, BookingStatus.NO_SHOW] },
      },
    });

    if (dayBookings.length >= service.maxBookingsPerDay) {
      throw new Error("No more sessions are available on that day.");
    }

    const conflict = dayBookings.some((booking) => overlaps(startsAt, endsAt, booking));
    if (conflict) {
      throw new Error("That slot has just been taken. Please choose another time.");
    }

    return tx.booking.create({
      data: {
        serviceId: service.id,
        studentId: input.userId,
        consultantId,
        kind: service.bookingKind,
        status: BookingStatus.CONFIRMED,
        startsAt,
        endsAt,
        timezone: input.timezone,
        notes: input.notes?.trim() ? input.notes.trim() : null,
        paymentRequired: false,
        paymentStatus: PaymentStatus.SUCCEEDED,
      },
      include: { service: true },
    });
  });
}
