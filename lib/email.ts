import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

/**
 * Service d'emails. Trois providers :
 *  - "log"   : developpement. Enregistre l'email en base (EmailLog) + console.
 *  - "resend": envoi via l'API Resend (si RESEND_API_KEY).
 *  - "smtp"  : point d'extension (necessite nodemailer en production).
 *
 * Dans tous les cas, chaque envoi est journalise dans EmailLog.
 */

export type EmailVars = Record<string, string | number | null | undefined>;

export function renderTemplate(template: string, vars: EmailVars): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => {
    const v = vars[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

/** Habillage HTML institutionnel commun a tous les emails. */
export function wrapHtml(innerHtml: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f6f4;font-family:Arial,Helvetica,sans-serif;color:#121212;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#00860B;color:#fff;padding:18px 24px;border-radius:14px 14px 0 0;">
      <strong style="font-size:18px;letter-spacing:.5px;">OIJD</strong>
      <span style="opacity:.85;font-size:12px;display:block;">${siteConfig.fullNameWithSection}</span>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 14px 14px;line-height:1.6;font-size:15px;">
      ${innerHtml}
    </div>
    <p style="color:#667085;font-size:11px;text-align:center;margin-top:18px;">
      ${siteConfig.digitalAccess.creditPrivate}
    </p>
  </div></body></html>`;
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateKey?: string;
  submissionId?: string | null;
};

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean }> {
  const provider = process.env.EMAIL_PROVIDER || "log";
  const from = process.env.EMAIL_FROM || "OIJD <noreply@oijd-civ.org>";
  let status = "LOGGED";
  let error: string | null = null;

  try {
    if (provider === "resend" && process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: args.to,
          subject: args.subject,
          html: args.html,
          text: args.text,
        }),
      });
      status = res.ok ? "SENT" : "FAILED";
      if (!res.ok) error = `Resend HTTP ${res.status}`;
    } else {
      // Provider "log" (ou config manquante) : on journalise sans envoyer.
      status = "LOGGED";
      console.info(
        `\n[email:${provider}] -> ${args.to}\n  Sujet: ${args.subject}\n  (enregistre dans EmailLog)\n`,
      );
    }
  } catch (err) {
    status = "FAILED";
    error = err instanceof Error ? err.message : String(err);
  }

  try {
    await prisma.emailLog.create({
      data: {
        to: args.to,
        subject: args.subject,
        bodyHtml: args.html,
        templateKey: args.templateKey ?? null,
        submissionId: args.submissionId ?? null,
        status,
        error,
        sentAt: status === "SENT" || status === "LOGGED" ? new Date() : null,
      },
    });
  } catch (err) {
    console.error("[email] echec d'enregistrement du log:", err);
  }

  return { ok: status !== "FAILED" };
}

/** Envoie un email a partir d'un modele enregistre (EmailTemplate). */
export async function sendTemplatedEmail(
  key: string,
  to: string,
  vars: EmailVars,
  submissionId?: string | null,
): Promise<{ ok: boolean }> {
  const template = await prisma.emailTemplate.findUnique({ where: { key } });
  if (!template || !template.isActive) {
    console.warn(`[email] modele introuvable ou inactif: ${key}`);
    return { ok: false };
  }
  const baseVars: EmailVars = {
    organizationName: siteConfig.fullNameWithSection,
    contactEmail: siteConfig.contact.email,
    platformUrl: process.env.APP_URL || siteConfig.url,
    ...vars,
  };
  const subject = renderTemplate(template.subject, baseVars);
  const inner = renderTemplate(template.bodyHtml, baseVars);
  const html = wrapHtml(inner);
  const text = template.bodyText
    ? renderTemplate(template.bodyText, baseVars)
    : undefined;
  return sendEmail({ to, subject, html, text, templateKey: key, submissionId });
}
