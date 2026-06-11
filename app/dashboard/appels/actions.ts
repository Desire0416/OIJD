"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { opportunitySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugs";
import { toDate, linesToJson, csvToArray, boolFrom, optStr } from "@/lib/dash-forms";
import { toJson } from "@/lib/json";
import { defaultFormSchema, defaultScoring } from "@/lib/form-templates";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function readForm(formData: FormData) {
  return opportunitySchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    status: formData.get("status"),
    summary: formData.get("summary") || undefined,
    context: formData.get("context") || undefined,
    objectives: formData.get("objectives") || undefined,
    targetAudience: formData.get("targetAudience") || undefined,
    eligibility: formData.get("eligibility") || undefined,
    selectionCriteria: formData.get("selectionCriteria") || undefined,
    requiredDocuments: formData.get("requiredDocuments") || undefined,
    openingDate: formData.get("openingDate") || undefined,
    deadline: formData.get("deadline") || undefined,
    processCalendar: formData.get("processCalendar") || undefined,
    submissionGuidelines: formData.get("submissionGuidelines") || undefined,
    contactInfo: formData.get("contactInfo") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    domain: formData.get("domain") || undefined,
    educationLevel: formData.get("educationLevel") || undefined,
    featured: formData.get("featured") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    keywords: formData.get("keywords") || undefined,
  });
}

function buildData(d: ReturnType<typeof readForm>["data"], formData: FormData) {
  const keywords = csvToArray(formData.get("keywords"));
  return {
    title: d!.title,
    type: d!.type,
    status: d!.status,
    summary: optStr(d!.summary),
    context: optStr(d!.context),
    objectives: optStr(d!.objectives),
    targetAudience: optStr(d!.targetAudience),
    eligibility: optStr(d!.eligibility),
    selectionCriteria: optStr(d!.selectionCriteria),
    requiredDocuments: linesToJson(formData.get("requiredDocuments")),
    openingDate: toDate(formData.get("openingDate")),
    deadline: toDate(formData.get("deadline")),
    processCalendar: optStr(d!.processCalendar),
    submissionGuidelines: optStr(d!.submissionGuidelines),
    contactInfo: optStr(d!.contactInfo),
    country: optStr(d!.country),
    city: optStr(d!.city),
    domain: optStr(d!.domain),
    educationLevel: optStr(d!.educationLevel),
    featured: boolFrom(formData.get("featured")),
    departmentId: optStr(d!.departmentId),
    formSchema: toJson(defaultFormSchema(d!.type)),
    scoringCriteria: toJson(defaultScoring(d!.type, keywords)),
  };
}

export async function createOpportunity(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "opportunities.manage"))
    return { error: "Non autorise." };
  const parsed = readForm(formData);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };

  const slug = await uniqueSlug("opportunity", parsed.data.title);
  const opp = await prisma.opportunity.create({
    data: { slug, ...buildData(parsed.data, formData) },
  });
  await logAudit({
    userId: user.id,
    action: "OPPORTUNITY_CREATED",
    entityType: "Opportunity",
    entityId: opp.id,
    newValue: { title: opp.title, status: opp.status },
  });
  revalidatePath("/dashboard/appels");
  redirect(`/dashboard/appels/${opp.id}`);
}

export async function updateOpportunity(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "opportunities.manage"))
    return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = readForm(formData);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };

  const slug = await uniqueSlug("opportunity", parsed.data.title, id);
  await prisma.opportunity.update({
    where: { id },
    data: { slug, ...buildData(parsed.data, formData) },
  });
  await logAudit({
    userId: user.id,
    action: "OPPORTUNITY_UPDATED",
    entityType: "Opportunity",
    entityId: id,
  });
  revalidatePath("/dashboard/appels");
  revalidatePath(`/dashboard/appels/${id}`);
  redirect(`/dashboard/appels/${id}`);
}

/** Supprime un appel sans dossier ; sinon l'archive (securite des donnees). */
export async function deleteOpportunity(formData: FormData): Promise<void> {
  const user = await getActor();
  if (!user || !can(user.role, "opportunities.manage")) return;
  const id = String(formData.get("id") || "");
  const count = await prisma.submission.count({ where: { opportunityId: id } });
  if (count > 0) {
    await prisma.opportunity.update({ where: { id }, data: { status: "ARCHIVED" } });
    await logAudit({
      userId: user.id,
      action: "OPPORTUNITY_ARCHIVED",
      entityType: "Opportunity",
      entityId: id,
    });
  } else {
    await prisma.document.deleteMany({ where: { opportunityId: id } });
    await prisma.opportunity.delete({ where: { id } });
    await logAudit({
      userId: user.id,
      action: "OPPORTUNITY_DELETED",
      entityType: "Opportunity",
      entityId: id,
    });
  }
  revalidatePath("/dashboard/appels");
  redirect("/dashboard/appels");
}
