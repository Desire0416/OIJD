import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { PartnerForm } from "@/components/dashboard/partner-form";
import { Icon } from "@/components/ui/icon";
import { updatePartner } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("partners.manage");
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  const initial = {
    id: partner.id,
    name: partner.name,
    description: partner.description ?? "",
    logoUrl: partner.logoUrl ?? "",
    websiteUrl: partner.websiteUrl ?? "",
    partnershipType: partner.partnershipType ?? "",
    order: partner.order,
    isActive: partner.isActive,
  };

  return (
    <>
      <Link
        href="/dashboard/partenaires"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux partenaires
      </Link>
      <PageTitle title="Modifier le partenaire" description={partner.name} />
      <PartnerForm action={updatePartner} initial={initial} submitLabel="Enregistrer" />
    </>
  );
}
