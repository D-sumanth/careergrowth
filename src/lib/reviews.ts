import { ReviewStatus, UploadVisibility, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";
import { storeUploadedFile } from "@/lib/storage/uploads";

export async function uploadDeliveredReviewDocument(input: {
  reviewRequestId: string;
  actorId: string;
  file: File;
}) {
  if (isMockMode() || !prisma) {
    const stored = await storeUploadedFile(input.file);
    return {
      document: {
        id: `mock-review-doc-${Date.now()}`,
        reviewRequestId: input.reviewRequestId,
        ownerId: input.actorId,
        ...stored,
        visibility: UploadVisibility.SHARED,
        createdAt: new Date(),
      },
    };
  }

  const stored = await storeUploadedFile(input.file);

  return prisma.$transaction(async (tx) => {
    const review = await tx.resumeReviewRequest.findUnique({
      where: { id: input.reviewRequestId },
    });

    if (!review) {
      throw new Error("Review request not found.");
    }

    const document = await tx.uploadedDocument.create({
      data: {
        ownerId: input.actorId,
        reviewRequestId: input.reviewRequestId,
        fileName: stored.fileName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        storageKey: stored.storageKey,
        visibility: UploadVisibility.SHARED,
      },
    });

    await tx.resumeReviewRequest.update({
      where: { id: input.reviewRequestId },
      data: {
        status: ReviewStatus.DELIVERED,
      },
    });

    return { document };
  });
}

export async function getAccessibleDocumentForUser(input: {
  documentId: string;
  userId: string;
  role: UserRole;
}) {
  if (!prisma || isMockMode()) {
    throw new Error("Document downloads require the database.");
  }

  const document = await prisma.uploadedDocument.findUnique({
    where: { id: input.documentId },
    include: { reviewRequest: true },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  if (input.role === "ADMIN") {
    return document;
  }

  if (document.ownerId === input.userId) {
    return document;
  }

  if (
    document.visibility === UploadVisibility.SHARED &&
    document.reviewRequest &&
    (document.reviewRequest.requesterId === input.userId || document.reviewRequest.assignedToId === input.userId)
  ) {
    return document;
  }

  throw new Error("You do not have access to this document.");
}
