"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { parseObject, toJson } from "@/lib/json";
import { computeScore, type ScoringCriteria } from "@/lib/scoring";
import { parseArray } from "@/lib/json";
import { sendTemplatedEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import {
  SUBMISSION_ACTIONS,
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_META,
  OPPORTUNITY_TYPE_META,
  type SubmissionStatus,
  type OpportunityType,
} from "@/lib/constants";

type ActionResult = { ok: boolean; error?: string };

const EMAIL_BY_STATUS = new Map(
  SUBMISSION_ACTIONS.filter((a) => a.emailTemplate).map((a) => [
    a.status,
    a.emailTemplate as string,
  ]),
);
const DECISION_STATUSES = new Set(["RETAINED", "REJECTED", "FINAL_VALIDATED"]);

export async function changeSubmissionStatus(
  formData: FormData,
): Promise<ActionResult> {
  const user = await getActor();
  if (!user || !can(user.role, "submissions.decide"))
    return { ok: false, error: "Non autorise." };

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as SubmissionStatus;
  const comment = String(formData.get("comment") || "").trim();
  const wantEmail = String(formData.get("sendEmail") || "") === "on";

  if (!SUBMISSION_STATUS.includes(status))
    return { ok: false, error: "Statut invalide." };

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { opportunity: true },
  });
  if (!submission) return { ok: false, error: "Dossier introuvable." };
  const oldStatus = submission.status;

  await prisma.submission.update({
    where: { id },
    data: {
      status,
      ...(DECISION_STATUSES.has(status)
        ? {
            finalDecision: SUBMISSION_STATUS_META[status].label,
            decidedById: user.id,
            decidedAt: new Date(),
          }
        : {}),
    },
  });

  await prisma.submissionStatusHistory.create({
    data: {
      submissionId: id,
      oldStatus,
      newStatus: status,
      changedById: user.id,
      comment: comment || null,
    },
  });

  await logAudit({
    userId: user.id,
    action: "SUBMISSION_STATUS_CHANGED",
    entityType: "Submission",
    entityId: id,
    oldValue: { status: oldStatus },
    newValue: { status, comment },
  });

  const templateKey = EMAIL_BY_STATUS.get(status);
  if (wantEmail && templateKey) {
    const name =
      submission.title ||
      [submission.firstName, submission.lastName].filter(Boolean).join(" ") ||
      submission.email;
    await sendTemplatedEmail(
      templateKey,
      submission.email,
      {
        candidateName: name,
        submissionTitle: submission.title ?? name,
        callTitle: submission.opportunity.title,
        callType:
          OPPORTUNITY_TYPE_META[submission.opportunity.type as OpportunityType]
            ?.label ?? "",
        reference: submission.reference,
        status: SUBMISSION_STATUS_META[status].label,
        nextStep: comment,
      },
      id,
    );
  }

  revalidatePath(`/dashboard/dossiers/${id}`);
  revalidatePath("/dashboard/dossiers");
  return { ok: true };
}

export async function addInternalNote(formData: FormData): Promise<ActionResult> {
  const user = await getActor();
  if (!user || !can(user.role, "submissions.view"))
    return { ok: false, error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const content = String(formData.get("content") || "").trim();
  if (content.length < 2) return { ok: false, error: "Note trop courte." };

  await prisma.internalNote.create({
    data: { submissionId: id, authorId: user.id, content },
  });
  await logAudit({
    userId: user.id,
    action: "NOTE_ADDED",
    entityType: "Submission",
    entityId: id,
  });
  revalidatePath(`/dashboard/dossiers/${id}`);
  return { ok: true };
}

/** Variante a retour void pour usage direct en `<form action=...>`. */
export async function recomputeScoreForm(formData: FormData): Promise<void> {
  await recomputeScore(formData);
}

export async function recomputeScore(formData: FormData): Promise<ActionResult> {
  const user = await getActor();
  if (!user || !can(user.role, "submissions.view"))
    return { ok: false, error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { opportunity: true, documents: true },
  });
  if (!submission) return { ok: false, error: "Dossier introuvable." };

  const scoring = parseObject<ScoringCriteria>(
    submission.opportunity.scoringCriteria,
    {},
  );
  const result = computeScore({
    type: submission.opportunity.type,
    scoringCriteria: scoring,
    requiredDocuments: parseArray<string>(submission.opportunity.requiredDocuments),
    formData: parseObject<Record<string, unknown>>(submission.formData, {}),
    documents: submission.documents.map((d) => ({ type: d.type, name: d.name })),
  });

  await prisma.submission.update({
    where: { id },
    data: {
      score: result.score,
      scoreLabel: result.scoreLabel,
      complete: result.complete,
      scoreDetails: toJson(result.scoreDetails),
      matchedCriteria: toJson(result.matchedCriteria),
      missingCriteria: toJson(result.missingCriteria),
      recommendationSummary: result.recommendationSummary,
    },
  });
  revalidatePath(`/dashboard/dossiers/${id}`);
  return { ok: true };
}
