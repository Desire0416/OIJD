import { prisma } from "@/lib/prisma";
import { toJson } from "@/lib/json";

type AuditInput = {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

/**
 * Journalise une action sensible. N'interrompt jamais le flux principal :
 * en cas d'erreur, on log en console sans relancer.
 */
export async function logAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        oldValue: input.oldValue === undefined ? null : toJson(input.oldValue),
        newValue: input.newValue === undefined ? null : toJson(input.newValue),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] echec d'ecriture du journal:", err);
  }
}
