"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { departmentSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugs";
import { linesToJson, boolFrom, optStr } from "@/lib/dash-forms";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function parse(formData: FormData) {
  return departmentSchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    mission: formData.get("mission") || undefined,
    responsibilities: formData.get("responsibilities") || undefined,
    publicEmail: formData.get("publicEmail") || undefined,
    headId: formData.get("headId") || undefined,
    order: formData.get("order") || undefined,
    isActive: formData.get("isActive") || undefined,
  });
}

function data(d: NonNullable<ReturnType<typeof parse>["data"]>, formData: FormData) {
  return {
    name: d.name,
    icon: optStr(d.icon),
    shortDescription: optStr(d.shortDescription),
    description: optStr(d.description),
    mission: optStr(d.mission),
    responsibilities: linesToJson(formData.get("responsibilities")),
    publicEmail: optStr(d.publicEmail),
    headId: optStr(d.headId),
    order: d.order ?? 0,
    isActive: boolFrom(formData.get("isActive")),
  };
}

export async function createDepartment(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "departments.manage")) return { error: "Non autorise." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("department", parsed.data.name);
  const dept = await prisma.department.create({ data: { slug, ...data(parsed.data, formData) } });
  await logAudit({ userId: user.id, action: "DEPARTMENT_CREATED", entityType: "Department", entityId: dept.id });
  revalidatePath("/dashboard/departements");
  revalidatePath("/departements");
  redirect("/dashboard/departements");
}

export async function updateDepartment(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "departments.manage")) return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("department", parsed.data.name, id);
  await prisma.department.update({ where: { id }, data: { slug, ...data(parsed.data, formData) } });
  await logAudit({ userId: user.id, action: "DEPARTMENT_UPDATED", entityType: "Department", entityId: id });
  revalidatePath("/dashboard/departements");
  revalidatePath("/departements");
  redirect("/dashboard/departements");
}
