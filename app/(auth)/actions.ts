"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";
import { sendEmail, wrapHtml } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { siteConfig } from "@/lib/site-config";

export type AuthState = { error?: string; success?: string };

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Email ou mot de passe invalide." };
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE") {
    return { error: "Identifiants incorrects ou compte inactif." };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await logAudit({
      userId: user.id,
      action: "LOGIN_FAILED",
      entityType: "User",
      entityId: user.id,
    });
    return { error: "Identifiants incorrects." };
  }

  await createSession(user);
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await logAudit({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
  });

  const from = String(formData.get("from") || "");
  redirect(from && from.startsWith("/dashboard") ? from : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  const generic = {
    success:
      "Si un compte existe pour cet email, un lien de reinitialisation vous a ete envoye.",
  };
  if (!parsed.success) return generic;

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (user) {
    const token = randomUUID() + randomUUID().replace(/-/g, "");
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExp: new Date(Date.now() + 3600_000) },
    });
    const url = `${process.env.APP_URL || siteConfig.url}/reinitialiser-mot-de-passe?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reinitialisation de votre mot de passe - OIJD",
      html: wrapHtml(
        `<p>Bonjour ${user.name},</p><p>Vous avez demande la reinitialisation de votre mot de passe.</p><p><a href="${url}">Cliquez ici pour definir un nouveau mot de passe</a> (lien valable 1 heure).</p><p>Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>`,
      ),
    });
    await logAudit({
      userId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "User",
      entityId: user.id,
    });
  }
  return generic;
}

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  }
  const { token, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExp: { gt: new Date() } },
  });
  if (!user) {
    return { error: "Lien invalide ou expire. Refaites une demande." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExp: null,
    },
  });
  await logAudit({
    userId: user.id,
    action: "PASSWORD_RESET",
    entityType: "User",
    entityId: user.id,
  });
  redirect("/login?reset=1");
}
