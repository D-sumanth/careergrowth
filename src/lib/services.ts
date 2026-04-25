import { BookingKind, type Service } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { services as staticServices } from "@/lib/data/site-content";

export type ServiceCatalogItem = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  whoItIsFor: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  includedItems: string[];
  durationMinutes: number | null;
  pricePence: number;
  sessionBufferMins: number;
  maxBookingsPerDay: number;
  bookingKind: BookingKind;
  isBookable: boolean;
};

function parseDurationMinutes(input: string) {
  const rangeMatch = input.match(/(\d+)\s*to\s*(\d+)\s*minutes/i);
  if (rangeMatch) return Number(rangeMatch[2]);

  const exactMatch = input.match(/(\d+)\s*minutes/i);
  if (exactMatch) return Number(exactMatch[1]);

  return null;
}

function mapStaticService(service: (typeof staticServices)[number]): ServiceCatalogItem {
  const durationMinutes = parseDurationMinutes(service.duration);
  const isBookable =
    durationMinutes !== null &&
    !service.slug.includes("workshops") &&
    !service.slug.includes("course") &&
    !service.slug.includes("cv-resume-review");

  return {
    slug: service.slug,
    title: service.title,
    description: service.description,
    shortDescription: service.description,
    whoItIsFor: service.who,
    imageUrl: null,
    videoUrl: null,
    includedItems: service.included,
    durationMinutes,
    pricePence: service.pricePence,
    sessionBufferMins: 15,
    maxBookingsPerDay: 6,
    bookingKind: BookingKind.ONE_TO_ONE,
    isBookable,
  };
}

function mapPrismaService(service: Service): ServiceCatalogItem {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    shortDescription: service.shortDescription,
    whoItIsFor: service.whoItIsFor,
    imageUrl: service.imageUrl ?? null,
    videoUrl: service.videoUrl ?? null,
    includedItems: Array.isArray(service.includedItems) ? (service.includedItems as string[]) : [],
    durationMinutes: service.durationMinutes > 0 ? service.durationMinutes : null,
    pricePence: service.pricePence,
    sessionBufferMins: service.sessionBufferMins,
    maxBookingsPerDay: service.maxBookingsPerDay,
    bookingKind: service.bookingKind,
    isBookable: service.bookingKind === BookingKind.ONE_TO_ONE && service.durationMinutes > 0,
  };
}

export function getStaticServiceBySlug(slug: string) {
  const match = staticServices.find((service) => service.slug === slug);
  return match ? mapStaticService(match) : null;
}

export async function getServiceBySlug(slug: string) {
  const dbService = prisma ? await prisma.service.findUnique({ where: { slug } }) : null;
  if (dbService) return mapPrismaService(dbService);
  return getStaticServiceBySlug(slug);
}

export async function ensureBookableServiceBySlug(slug: string) {
  const dbService = prisma ? await prisma.service.findUnique({ where: { slug } }) : null;
  if (dbService) {
    const normalized = mapPrismaService(dbService);
    return normalized.isBookable ? normalized : null;
  }

  const fallback = getStaticServiceBySlug(slug);
  if (!fallback?.isBookable || !prisma || fallback.durationMinutes === null) {
    return null;
  }

  const created = await prisma.service.create({
    data: {
      slug: fallback.slug,
      title: fallback.title,
      shortDescription: fallback.shortDescription,
      description: fallback.description,
      whoItIsFor: fallback.whoItIsFor,
      imageUrl: fallback.imageUrl ?? null,
      videoUrl: fallback.videoUrl ?? null,
      includedItems: fallback.includedItems,
      durationMinutes: fallback.durationMinutes,
      pricePence: fallback.pricePence,
      bookingKind: fallback.bookingKind,
      sessionBufferMins: fallback.sessionBufferMins,
      maxBookingsPerDay: fallback.maxBookingsPerDay,
      isActive: true,
    },
  });

  return mapPrismaService(created);
}
