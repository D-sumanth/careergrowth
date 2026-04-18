import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  password: z
    .string()
    .min(10, "Use at least 10 characters.")
    .regex(/[A-Z]/, "Add at least one uppercase letter.")
    .regex(/[a-z]/, "Add at least one lowercase letter.")
    .regex(/[0-9]/, "Add at least one number."),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: signUpSchema.shape.password,
});

export const newsletterSchema = z.object({
  email: z.email(),
  consent: z.literal(true),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  mobileNumber: z.string().max(30).optional().or(z.literal("")),
  category: z.enum(["GENERAL", "RESUME_REVIEW", "CORPORATE_WORKSHOP", "CONSULTATION"]),
  subject: z.string().min(5).max(120),
  message: z.string().min(20).max(2000),
});

export const bookingSchema = z.object({
  serviceSlug: z.string().min(2),
  startsAt: z.iso.datetime(),
  timezone: z.string().default("Europe/London"),
  notes: z.string().max(1000).optional(),
  sessionType: z.string().optional(),
});

export const availabilityQuerySchema = z.object({
  serviceSlug: z.string().min(2),
  date: z.string().min(10),
  timezone: z.string().default("Europe/London"),
});

export const resumeReviewSchema = z.object({
  service: z.string().min(2),
  linkedInUrl: z.url().optional().or(z.literal("")),
  jobTarget: z.string().min(3).max(120),
  industry: z.string().max(100).optional().or(z.literal("")),
  currentChallenge: z.string().min(10).max(1200),
  deadline: z.string().optional().or(z.literal("")),
  notes: z.string().max(1500).optional().or(z.literal("")),
});
