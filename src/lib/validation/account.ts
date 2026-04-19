import { z } from "zod";

export const accountProfileSchema = z.object({
  name: z.string().min(2).max(80),
  mobileNumber: z.string().max(30).optional().or(z.literal("")),
  university: z.string().max(120).optional().or(z.literal("")),
  degree: z.string().max(120).optional().or(z.literal("")),
  visaStatus: z.string().max(120).optional().or(z.literal("")),
  careerTarget: z.string().max(120).optional().or(z.literal("")),
  linkedInUrl: z.string().max(300).optional().or(z.literal("")),
  timezone: z.string().max(80).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const accountPasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(10).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    confirmPassword: z.string().min(10),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "New password and confirmation must match.",
    path: ["confirmPassword"],
  });
