"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { emailTemplateSchema } from "@/lib/validators";
import { boolFrom } from "@/lib/dash-forms";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

export async function updateEmailTemplate(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "emails.manage")) return { error: "Non autorise." };
  const key = String(formData.get("key") || "");
  const parsed = emailTemplateSchema.safeParse({
    subject: formData.get("subject"),
    bodyHtml: formData.get("bodyHtml"),
    isActive: formData.get("isActive") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };

  await prisma.emailTemplate.update({
    where: { key },
    data: {
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
      isActive: boolFrom(formData.get("isActive")),
    },
  });
  await logAudit({ userId: user.id, action: "EMAIL_TEMPLATE_UPDATED", entityType: "EmailTemplate", entityId: key });
  revalidatePath("/dashboard/emails");
  redirect("/dashboard/emails");
}
