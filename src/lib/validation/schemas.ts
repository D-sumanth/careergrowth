import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  email: z.email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Z]/, "Add at least one uppercase letter.")
    .regex(/[a-z]/, "Add at least one lowercase letter.")
    .regex(/[0-9]/, "Add at least one number.")
    .regex(/[^A-Za-z0-9]/, "Add at least one special character."),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((value) => value, "Please accept the Terms and Privacy Policy."),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
});

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "That reset link is invalid."),
  password: signUpSchema.shape.password,
  confirmPassword: z.string(),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
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
  documentIds: z.array(z.string()).optional().default([]),
});
