import { z } from "zod";

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, for example 09:00.");

export const availabilityRuleSchema = z
  .object({
    type: z.literal("rule"),
    consultantId: z.string().optional(),
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: timeString,
    endTime: timeString,
  })
  .refine((value) => value.startTime < value.endTime, {
    message: "End time must be later than the start time.",
    path: ["endTime"],
  });

export const availabilityOverrideSchema = z
  .object({
    type: z.literal("override"),
    consultantId: z.string().optional(),
    date: z.string().min(10),
    startTime: timeString.optional().or(z.literal("")),
    endTime: timeString.optional().or(z.literal("")),
    isAvailable: z.coerce.boolean(),
    reason: z.string().max(160).optional().or(z.literal("")),
  })
  .refine(
    (value) => {
      if (!value.isAvailable) return true;
      if (!value.startTime || !value.endTime) return false;
      return value.startTime < value.endTime;
    },
    {
      message: "Available overrides need both a start and end time.",
      path: ["startTime"],
    },
  );

export const availabilityMutationSchema = z.discriminatedUnion("type", [availabilityRuleSchema, availabilityOverrideSchema]);
