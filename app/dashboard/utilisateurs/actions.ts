"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { userSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth/password";
import { optStr } from "@/lib/dash-forms";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function parse(formData: FormData) {
  return userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status") || "ACTIVE",
    departmentId: formData.get("departmentId") || undefined,
    title: formData.get("title") || undefined,
    phone: formData.get("phone") || undefined,
    bio: formData.get("bio") || undefined,
    password: formData.get("password") || undefined,
  });
}

export async function createUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "users.manage")) return { error: "Non autorise." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const d = parsed.data;
  if (!d.password) return { error: "Le mot de passe est requis a la creation." };

  const existing = await prisma.user.findUnique({ where: { email: d.email } });
  if (existing) return { error: "Un compte existe deja avec cet email." };

  const created = await prisma.user.create({
    data: {
      name: d.name,
      email: d.email,
      role: d.role,
      status: d.status,
      departmentId: optStr(d.departmentId),
      title: optStr(d.title),
      phone: optStr(d.phone),
      bio: optStr(d.bio),
      passwordHash: await hashPassword(d.password),
    },
  });
  await logAudit({ userId: user.id, action: "USER_CREATED", entityType: "User", entityId: created.id, newValue: { email: d.email, role: d.role } });
  revalidatePath("/dashboard/utilisateurs");
  redirect("/dashboard/utilisateurs");
}

export async function updateUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "users.manage")) return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const d = parsed.data;

  const clash = await prisma.user.findFirst({
    where: { email: d.email, NOT: { id } },
  });
  if (clash) return { error: "Un autre compte utilise deja cet email." };

  await prisma.user.update({
    where: { id },
    data: {
      name: d.name,
      email: d.email,
      role: d.role,
      status: d.status,
      departmentId: optStr(d.departmentId),
      title: optStr(d.title),
      phone: optStr(d.phone),
      bio: optStr(d.bio),
      ...(d.password ? { passwordHash: await hashPassword(d.password) } : {}),
    },
  });
  await logAudit({ userId: user.id, action: "USER_UPDATED", entityType: "User", entityId: id });
  revalidatePath("/dashboard/utilisateurs");
  redirect("/dashboard/utilisateurs");
}

/** Desactive un compte (pas de suppression definitive pour preserver l'historique). */
export async function deactivateUser(formData: FormData): Promise<void> {
  const user = await getActor();
  if (!user || !can(user.role, "users.manage")) return;
  const id = String(formData.get("id") || "");
  if (id === user.id) return; // ne pas se desactiver soi-meme
  await prisma.user.update({ where: { id }, data: { status: "SUSPENDED" } });
  await logAudit({ userId: user.id, action: "USER_SUSPENDED", entityType: "User", entityId: id });
  revalidatePath("/dashboard/utilisateurs");
  redirect("/dashboard/utilisateurs");
}
