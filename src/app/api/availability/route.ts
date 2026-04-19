import { getSession } from "@/lib/auth/session";
import { createAvailabilityOverride, createAvailabilityRule, getAvailabilityManagerData } from "@/lib/availability";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { availabilityMutationSchema } from "@/lib/validation/availability";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "CONSULTANT")) {
    return jsonError("Authentication required.", 401);
  }

  const data = await getAvailabilityManagerData(session.userId, session.role);
  return jsonOk(data);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "CONSULTANT")) {
      return jsonError("Authentication required.", 401);
    }

    const payload = await parseJson(request, availabilityMutationSchema);
    const consultantId = session.role === "ADMIN" ? payload.consultantId : session.userId;
    if (!consultantId) {
      return jsonError("Consultant selection is required.", 400);
    }

    if (payload.type === "rule") {
      const rule = await createAvailabilityRule({
        consultantId,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
      });

      return jsonOk({ message: "Weekly availability added.", rule }, 201);
    }

    const override = await createAvailabilityOverride({
      consultantId,
      date: payload.date,
      startTime: payload.startTime || undefined,
      endTime: payload.endTime || undefined,
      isAvailable: payload.isAvailable,
      reason: payload.reason || undefined,
    });

    return jsonOk({ message: "Date override saved.", override }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to save availability.");
  }
}
