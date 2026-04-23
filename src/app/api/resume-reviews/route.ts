import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";
import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { resumeReviewSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, resumeReviewSchema);
    const session = await getSession();

    if (isMockMode() || !prisma) {
      return jsonOk(
        {
          message: "Resume review request submitted.",
          reviewRequest: {
            id: `mock_review_${Date.now()}`,
            requesterId: session?.userId ?? null,
            ...payload,
            status: "NEW",
          },
        },
        201,
      );
    }

    const reviewRequest = await prisma.$transaction(async (tx) => {
      const review = await tx.resumeReviewRequest.create({
        data: {
          requesterId: session?.userId ?? null,
          linkedInUrl: payload.linkedInUrl || null,
          jobTarget: payload.jobTarget,
          industry: payload.industry || null,
          currentChallenge: payload.currentChallenge,
          deadline: payload.deadline ? new Date(payload.deadline) : null,
          notes: payload.notes || null,
        },
        include: { documents: true },
      });

      if (session?.userId && payload.documentIds.length) {
        await tx.uploadedDocument.updateMany({
          where: {
            id: { in: payload.documentIds },
            ownerId: session.userId,
          },
          data: {
            reviewRequestId: review.id,
          },
        });
      }

      return tx.resumeReviewRequest.findUnique({
        where: { id: review.id },
        include: { documents: true },
      });
    });

    return jsonOk(
      {
        message: "Resume review request submitted.",
        reviewRequest,
      },
      201,
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to submit review request.");
  }
}
