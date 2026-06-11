import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { parseArray, parseObject } from "@/lib/json";
import { PageTitle } from "@/components/dashboard/page-title";
import { OpportunityForm } from "@/components/dashboard/opportunity-form";
import { Icon } from "@/components/ui/icon";
import { updateOpportunity } from "../../actions";

export const dynamic = "force-dynamic";

function isoDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("opportunities.manage");
  const { id } = await params;
  const [opp, departments] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id } }),
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!opp) notFound();

  const scoring = parseObject<{ keywords?: string[] }>(opp.scoringCriteria, {});
  const initial = {
    id: opp.id,
    title: opp.title,
    type: opp.type,
    status: opp.status,
    departmentId: opp.departmentId ?? "",
    featured: opp.featured,
    summary: opp.summary ?? "",
    context: opp.context ?? "",
    objectives: opp.objectives ?? "",
    targetAudience: opp.targetAudience ?? "",
    eligibility: opp.eligibility ?? "",
    selectionCriteria: opp.selectionCriteria ?? "",
    requiredDocuments: parseArray<string>(opp.requiredDocuments).join("\n"),
    keywords: (scoring.keywords ?? []).join(", "),
    openingDate: isoDate(opp.openingDate),
    deadline: isoDate(opp.deadline),
    processCalendar: opp.processCalendar ?? "",
    submissionGuidelines: opp.submissionGuidelines ?? "",
    contactInfo: opp.contactInfo ?? "",
    country: opp.country ?? "",
    city: opp.city ?? "",
    domain: opp.domain ?? "",
    educationLevel: opp.educationLevel ?? "",
  };

  return (
    <>
      <Link
        href={`/dashboard/appels/${opp.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour a l'appel
      </Link>
      <PageTitle title="Modifier l'appel" description={opp.title} />
      <OpportunityForm
        action={updateOpportunity}
        departments={departments}
        initial={initial}
        submitLabel="Enregistrer les modifications"
      />
    </>
  );
}
