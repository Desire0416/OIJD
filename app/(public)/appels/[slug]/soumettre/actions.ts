"use server";

import { prisma } from "@/lib/prisma";
import { parseArray, parseObject, toJson } from "@/lib/json";
import { submissionSchema } from "@/lib/validators";
import { saveFile, UploadError } from "@/lib/storage";
import { computeScore, type ScoringCriteria } from "@/lib/scoring";
import { sendTemplatedEmail } from "@/lib/email";
import { notifyNewSubmission } from "@/lib/notifications";
import { logAudit } from "@/lib/audit";
import { generateReference } from "@/lib/utils";
import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import type { FormSchema, SubmitResult } from "@/lib/submission-types";

function firstErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): Record<string, string> {
  const fe = error.flatten().fieldErrors;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v && v[0]) out[k] = v[0];
  return out;
}

export async function submitDossier(formData: FormData): Promise<SubmitResult> {
  const slug = String(formData.get("slug") || "");

  // Honeypot anti-spam
  if (String(formData.get("website") || "").length > 0) {
    return { ok: false, error: "Soumission refusee." };
  }

  const opp = await prisma.opportunity.findUnique({ where: { slug } });
  if (!opp) return { ok: false, error: "Appel introuvable." };

  const open =
    opp.status === "PUBLISHED" &&
    (!opp.deadline || opp.deadline.getTime() >= Date.now());
  if (!open) {
    return { ok: false, error: "Les soumissions pour cet appel sont closes." };
  }

  const parsed = submissionSchema.safeParse({
    submitterType: formData.get("submitterType") || "INDIVIDUAL",
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    organizationName: formData.get("organizationName") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    consent: formData.get("consent"),
    website: formData.get("website") || "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Veuillez corriger les champs indiques.",
      fieldErrors: firstErrors(parsed.error),
    };
  }
  const data = parsed.data;

  // Champs dynamiques pilotes par le schema de l'appel (source serveur)
  const schema = parseObject<FormSchema>(opp.formSchema, { fields: [] });
  const formValues: Record<string, string> = {};
  for (const f of schema.fields) {
    const v = formData.get(f.name);
    formValues[f.name] = typeof v === "string" ? v.trim() : "";
  }
  const missing = schema.fields.filter(
    (f) => f.required && !formValues[f.name],
  );
  if (missing.length > 0) {
    const fe: Record<string, string> = {};
    missing.forEach((f) => (fe[f.name] = `${f.label} requis.`));
    return {
      ok: false,
      error: "Des champs obligatoires sont manquants.",
      fieldErrors: fe,
    };
  }

  // Pieces jointes
  const incoming = formData
    .getAll("documents")
    .filter((x): x is File => x instanceof File && x.size > 0);
  const labels = parseArray<string>(String(formData.get("documentLabels") || "[]"));
  const saved: { label?: string; file: Awaited<ReturnType<typeof saveFile>> }[] =
    [];
  try {
    for (let i = 0; i < incoming.length; i++) {
      const file = await saveFile(incoming[i]);
      saved.push({ label: labels[i], file });
    }
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, error: err.message };
    return { ok: false, error: "Erreur lors du televersement des fichiers." };
  }

  const title =
    formValues.projectTitle ||
    formValues.companyName ||
    [data.firstName, data.lastName].filter(Boolean).join(" ") ||
    data.organizationName ||
    data.email;

  // Scoring (aide a l'analyse, sans elimination automatique)
  const scoring = parseObject<ScoringCriteria>(opp.scoringCriteria, {});
  const requiredDocs = parseArray<string>(opp.requiredDocuments);
  const score = computeScore({
    type: opp.type,
    scoringCriteria: scoring,
    requiredDocuments: requiredDocs,
    formData: formValues,
    documents: saved.map((s) => ({ type: s.label, name: s.file.originalName })),
  });

  const reference = generateReference();
  const submission = await prisma.submission.create({
    data: {
      reference,
      opportunityId: opp.id,
      status: score.complete ? "RECEIVED" : "PENDING_VERIFICATION",
      submitterType: data.submitterType,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      organizationName: data.organizationName || null,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      city: data.city || null,
      title,
      formData: toJson(formValues),
      complete: score.complete,
      score: score.score,
      scoreLabel: score.scoreLabel,
      scoreDetails: toJson(score.scoreDetails),
      matchedCriteria: toJson(score.matchedCriteria),
      missingCriteria: toJson(score.missingCriteria),
      recommendationSummary: score.recommendationSummary,
    },
  });

  for (const s of saved) {
    await prisma.document.create({
      data: {
        name: s.file.name,
        originalName: s.file.originalName,
        mimeType: s.file.mimeType,
        sizeBytes: s.file.sizeBytes,
        storageKey: s.file.storageKey,
        type: s.label || "PIECE",
        visibility: "CONFIDENTIAL",
        submissionId: submission.id,
        opportunityId: opp.id,
      },
    });
  }

  await prisma.submissionStatusHistory.create({
    data: {
      submissionId: submission.id,
      oldStatus: null,
      newStatus: submission.status,
      comment: "Dossier recu via la plateforme.",
    },
  });

  await sendTemplatedEmail(
    "submission_received",
    data.email,
    {
      candidateName: title,
      submissionTitle: title,
      callTitle: opp.title,
      callType: OPPORTUNITY_TYPE_META[opp.type as OpportunityType]?.label ?? "",
      reference,
      status: "Recu",
    },
    submission.id,
  );

  await notifyNewSubmission({
    opportunityTitle: opp.title,
    submissionId: submission.id,
    reference,
    departmentId: opp.departmentId,
  });

  await logAudit({
    action: "SUBMISSION_CREATED",
    entityType: "Submission",
    entityId: submission.id,
    newValue: { reference, opportunity: opp.slug, score: score.score },
  });

  return { ok: true, reference };
}
