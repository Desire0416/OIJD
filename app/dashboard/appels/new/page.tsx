import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { OpportunityForm } from "@/components/dashboard/opportunity-form";
import { Icon } from "@/components/ui/icon";
import { createOpportunity } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage() {
  await requireCapability("opportunities.manage");
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link
        href="/dashboard/appels"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux appels
      </Link>
      <PageTitle title="Nouvel appel" description="Le formulaire de soumission et la grille de scoring sont generes selon le type." />
      <OpportunityForm action={createOpportunity} departments={departments} submitLabel="Creer l'appel" />
    </>
  );
}
