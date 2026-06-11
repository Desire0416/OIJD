import Link from "next/link";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { PartnerForm } from "@/components/dashboard/partner-form";
import { Icon } from "@/components/ui/icon";
import { createPartner } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewPartnerPage() {
  await requireCapability("partners.manage");
  return (
    <>
      <Link
        href="/dashboard/partenaires"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux partenaires
      </Link>
      <PageTitle title="Nouveau partenaire" />
      <PartnerForm action={createPartner} submitLabel="Ajouter le partenaire" />
    </>
  );
}
