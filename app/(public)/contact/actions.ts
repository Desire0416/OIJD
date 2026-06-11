"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { notifyRoles } from "@/lib/notifications";
import { sendEmail, wrapHtml } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { siteConfig } from "@/lib/site-config";

type Result =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitContact(formData: FormData): Promise<Result> {
  if (String(formData.get("website") || "").length > 0) {
    return { ok: false, error: "Soumission refusee." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
    departmentId: formData.get("departmentId") || undefined,
    website: formData.get("website") || "",
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(fe)) if (v && v[0]) fieldErrors[k] = v[0];
    return {
      ok: false,
      error: "Veuillez corriger les champs indiques.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const departmentId =
    data.departmentId && data.departmentId.length > 0 ? data.departmentId : null;

  const message = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      departmentId,
      status: "NEW",
    },
  });

  await notifyRoles(
    ["SUPER_ADMIN", "ADMIN_GENERAL", "COMMUNICATION_MANAGER", "DEPARTMENT_HEAD"],
    {
      type: "CONTACT_MESSAGE",
      title: "Nouveau message de contact",
      message: `${data.name} : ${data.subject}`,
      link: "/dashboard/notifications",
    },
    { departmentId },
  );

  // Accuse de reception au visiteur
  await sendEmail({
    to: data.email,
    subject: `Nous avons bien recu votre message - ${siteConfig.name}`,
    html: wrapHtml(
      `<p>Bonjour ${data.name},</p><p>Nous accusons reception de votre message concernant : <strong>${data.subject}</strong>.</p><p>Notre equipe vous repondra dans les meilleurs delais.</p><p>Cordialement,<br/>${siteConfig.fullNameWithSection}</p>`,
    ),
  });

  await logAudit({
    action: "CONTACT_RECEIVED",
    entityType: "ContactMessage",
    entityId: message.id,
    newValue: { subject: data.subject },
  });

  return { ok: true };
}
