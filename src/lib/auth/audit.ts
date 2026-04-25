import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditEvent = {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
};

export async function writeAuditLog(event: AuditEvent) {
  if (!prisma) return;

  await prisma.auditLog.create({
    data: {
      actorId: event.actorId ?? null,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      metadata: (event.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}
