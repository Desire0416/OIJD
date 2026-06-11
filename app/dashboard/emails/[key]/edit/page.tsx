import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { EmailTemplateForm } from "@/components/dashboard/email-template-form";
import { Icon } from "@/components/ui/icon";
import { updateEmailTemplate } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireCapability("emails.manage");
  const { key } = await params;
  const template = await prisma.emailTemplate.findUnique({ where: { key } });
  if (!template) notFound();

  return (
    <>
      <Link
        href="/dashboard/emails"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux emails
      </Link>
      <PageTitle title={template.name} description="Modele d'email automatique." />
      <EmailTemplateForm
        templateKey={key}
        initial={{
          subject: template.subject,
          bodyHtml: template.bodyHtml,
          isActive: template.isActive,
        }}
        action={updateEmailTemplate}
      />
    </>
  );
}
