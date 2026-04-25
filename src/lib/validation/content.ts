import { BookingKind, InquiryStatus, ReviewStatus, WorkshopStatus } from "@prisma/client";
import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal("")).nullable();

const youtubeUrlSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .nullable()
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname);
    } catch {
      return false;
    }
  }, "Please enter a valid YouTube URL.");

export const serviceAdminSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(240),
  description: z.string().min(20).max(2000),
  whoItIsFor: z.string().min(10).max(600),
  imageUrl: optionalUrl,
  videoUrl: youtubeUrlSchema,
  includedItemsText: z.string().min(3).max(1500),
  durationMinutes: z.coerce.number().int().min(0).max(480),
  pricePence: z.coerce.number().int().min(0),
  compareAtPricePence: z.coerce.number().int().min(0).optional().nullable(),
  bookingKind: z.nativeEnum(BookingKind).default(BookingKind.ONE_TO_ONE),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});

export const testimonialAdminSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().max(120).optional().or(z.literal("")),
  content: z.string().min(10).max(2000),
  imageUrl: optionalUrl,
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
});

export const postAdminSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180),
  topic: z.string().max(80).optional().or(z.literal("")),
  excerpt: z.string().max(240).optional().or(z.literal("")),
  content: z.string().min(20).max(20000),
  published: z.coerce.boolean().default(false),
});

export const faqAdminSchema = z.object({
  question: z.string().min(6).max(300),
  answer: z.string().min(6).max(3000),
});

export const workshopAdminSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180),
  description: z.string().min(20).max(3000),
  imageUrl: optionalUrl,
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  timezone: z.string().min(3).max(80).default("Europe/London"),
  seatLimit: z.coerce.number().int().min(1).max(5000),
  waitlistEnabled: z.coerce.boolean().default(true),
  pricePence: z.coerce.number().int().min(0),
  compareAtPricePence: z.coerce.number().int().min(0).optional().nullable(),
  status: z.nativeEnum(WorkshopStatus).default(WorkshopStatus.DRAFT),
  replayUrl: z.string().url().optional().or(z.literal("")).nullable(),
  downloadUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export const inquiryAdminUpdateSchema = z.object({
  status: z.nativeEnum(InquiryStatus),
  assignedTo: z.string().max(120).optional().or(z.literal("")),
});

export const reviewAdminUpdateSchema = z.object({
  status: z.nativeEnum(ReviewStatus),
  assignedToId: z.string().optional().or(z.literal("")),
  notes: z.string().max(4000).optional().or(z.literal("")),
  deliverySummary: z.string().max(4000).optional().or(z.literal("")),
  turnaroundHours: z.coerce.number().int().min(0).max(720).optional().nullable(),
});

export const siteContentSettingsSchema = z.object({
  name: z.string().min(3).max(180),
  consultantName: z.string().min(2).max(120),
  tagline: z.string().min(6).max(180),
  email: z.string().min(3).max(180),
  phone: z.string().min(3).max(120),
  whatsapp: z.string().max(180).optional().or(z.literal("")),
  location: z.string().min(2).max(120),
  linkedin: z.string().url(),
  instagram: z.string().max(180).optional().or(z.literal("")),
  heroBadge: z.string().min(3).max(120),
  heroTitle: z.string().min(12).max(220),
  heroDescription: z.string().min(20).max(400),
  mission: z.string().min(20).max(400),
  credibility: z.string().min(20).max(400),
  contactNote: z.string().min(10).max(400),
  aboutTitle: z.string().min(12).max(220),
  aboutIntro: z.string().min(20).max(500),
  aboutBody: z.string().min(20).max(800),
  valuesText: z.string().min(10).max(1200),
  workshopsTitle: z.string().min(12).max(220),
  workshopsDescription: z.string().min(20).max(400),
  footerDescription: z.string().min(20).max(300),
});
