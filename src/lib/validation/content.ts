import { BookingKind } from "@prisma/client";
import { z } from "zod";

export const serviceAdminSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(240),
  description: z.string().min(20).max(2000),
  whoItIsFor: z.string().min(10).max(600),
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
