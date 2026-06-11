"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { partnerSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugs";
import { boolFrom, optStr } from "@/lib/dash-forms";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function parse(formData: FormData) {
  return partnerSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    partnershipType: formData.get("partnershipType") || undefined,
    order: formData.get("order") || undefined,
    isActive: formData.get("isActive") || undefined,
  });
}

function data(d: NonNullable<ReturnType<typeof parse>["data"]>, formData: FormData) {
  return {
    name: d.name,
    description: optStr(d.description),
    logoUrl: optStr(d.logoUrl),
    websiteUrl: d.websiteUrl ? d.websiteUrl : null,
    partnershipType: optStr(d.partnershipType),
    order: d.order ?? 0,
    isActive: boolFrom(formData.get("isActive")),
  };
}

export async function createPartner(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "partners.manage")) return { error: "Non autorise." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("partner", parsed.data.name);
  const p = await prisma.partner.create({ data: { slug, ...data(parsed.data, formData) } });
  await logAudit({ userId: user.id, action: "PARTNER_CREATED", entityType: "Partner", entityId: p.id });
  revalidatePath("/dashboard/partenaires");
  revalidatePath("/partenaires");
  redirect("/dashboard/partenaires");
}

export async function updatePartner(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "partners.manage")) return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const slug = await uniqueSlug("partner", parsed.data.name, id);
  await prisma.partner.update({ where: { id }, data: { slug, ...data(parsed.data, formData) } });
  await logAudit({ userId: user.id, action: "PARTNER_UPDATED", entityType: "Partner", entityId: id });
  revalidatePath("/dashboard/partenaires");
  revalidatePath("/partenaires");
  redirect("/dashboard/partenaires");
}

export async function deletePartner(formData: FormData): Promise<void> {
  const user = await getActor();
  if (!user || !can(user.role, "partners.manage")) return;
  const id = String(formData.get("id") || "");
  await prisma.partner.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "PARTNER_DELETED", entityType: "Partner", entityId: id });
  revalidatePath("/dashboard/partenaires");
  revalidatePath("/partenaires");
  redirect("/dashboard/partenaires");
}
