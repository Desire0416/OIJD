"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { activitySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugs";
import { toDate, csvToArray, boolFrom, optStr } from "@/lib/dash-forms";
import { toJson } from "@/lib/json";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function parse(formData: FormData) {
  return activitySchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    description: formData.get("description"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    objectives: formData.get("objectives") || undefined,
    results: formData.get("results") || undefined,
    status: formData.get("status") || "PLANNED",
    coverImage: formData.get("coverImage") || undefined,
    partners: formData.get("partners") || undefined,
    featured: formData.get("featured") || undefined,
    departmentId: formData.get("departmentId") || undefined,
  });
}

function data(d: NonNullable<ReturnType<typeof parse>["data"]>, formData: FormData) {
  return {
    title: d.title,
    excerpt: optStr(d.excerpt),
    description: d.description,
    location: optStr(d.location),
    startDate: toDate(formData.get("startDate")),
    endDate: toDate(formData.get("endDate")),
    objectives: optStr(d.objectives),
    results: optStr(d.results),
    status: d.status,
    coverImage: optStr(d.coverImage),
    partners: toJson(csvToArray(formData.get("partners"))),
    featured: boolFrom(formData.get("featured")),
    departmentId: optStr(d.departmentId),
  };
}

export async function createActivity(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "activities.create")) return { error: "Non autorise." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("activity", parsed.data.title);
  const activity = await prisma.activity.create({
    data: { slug, authorId: user.id, ...data(parsed.data, formData) },
  });
  await logAudit({ userId: user.id, action: "ACTIVITY_CREATED", entityType: "Activity", entityId: activity.id });
  revalidatePath("/dashboard/activites");
  revalidatePath("/activites");
  redirect("/dashboard/activites");
}

export async function updateActivity(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "activities.create")) return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("activity", parsed.data.title, id);
  await prisma.activity.update({ where: { id }, data: { slug, ...data(parsed.data, formData) } });
  await logAudit({ userId: user.id, action: "ACTIVITY_UPDATED", entityType: "Activity", entityId: id });
  revalidatePath("/dashboard/activites");
  revalidatePath("/activites");
  redirect("/dashboard/activites");
}

export async function deleteActivity(formData: FormData): Promise<void> {
  const user = await getActor();
  if (!user || !can(user.role, "activities.create")) return;
  const id = String(formData.get("id") || "");
  await prisma.document.deleteMany({ where: { activityId: id } });
  await prisma.activity.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "ACTIVITY_DELETED", entityType: "Activity", entityId: id });
  revalidatePath("/dashboard/activites");
  revalidatePath("/activites");
  redirect("/dashboard/activites");
}
