import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { can, isDepartmentScoped } from "@/lib/permissions";
import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/dashboard/confirm-submit";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { deleteOpportunity } from "./actions";

export const dynamic = "force-dynamic";

export default async function AppelsAdminPage() {
  const user = await requireCapability("submissions.view");
  const manage = can(user.role, "opportunities.manage");
  const where =
    isDepartmentScoped(user.role) && user.departmentId
      ? { departmentId: user.departmentId }
      : {};

  const opportunities = await prisma.opportunity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } }, department: { select: { name: true } } },
  });

  return (
    <>
      <PageTitle title="Appels & opportunites" description="Creez et pilotez les appels du centre des opportunites.">
        {manage ? (
          <Link href="/dashboard/appels/new" className={buttonVariants({ size: "sm" })}>
            <Icon name="Plus" size={16} />
            Nouvel appel
          </Link>
        ) : null}
      </PageTitle>

      {opportunities.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Titre</TH>
              <TH>Type</TH>
              <TH>Statut</TH>
              <TH>Echeance</TH>
              <TH>Dossiers</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {opportunities.map((o) => (
              <TR key={o.id}>
                <TD className="max-w-[260px]">
                  <Link href={`/dashboard/appels/${o.id}`} className="font-semibold text-ink hover:text-ojid-green">
                    <span className="line-clamp-1">{o.title}</span>
                  </Link>
                  {o.department ? (
                    <span className="text-xs text-muted">{o.department.name}</span>
                  ) : null}
                </TD>
                <TD className="text-muted">
                  {OPPORTUNITY_TYPE_META[o.type as OpportunityType]?.label ?? o.type}
                </TD>
                <TD>
                  <StatusBadge kind="opportunity" value={o.status} />
                </TD>
                <TD className="whitespace-nowrap text-muted">
                  {o.deadline ? formatDate(o.deadline) : "-"}
                </TD>
                <TD>
                  <Link
                    href={`/dashboard/dossiers?appel=${o.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-ojid-green"
                  >
                    {o._count.submissions}
                  </Link>
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/dashboard/appels/${o.id}`}
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Voir"
                    >
                      <Icon name="Eye" size={17} />
                    </Link>
                    {manage ? (
                      <>
                        <Link
                          href={`/dashboard/appels/${o.id}/edit`}
                          className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                          aria-label="Modifier"
                        >
                          <Icon name="Pencil" size={17} />
                        </Link>
                        <form action={deleteOpportunity}>
                          <input type="hidden" name="id" value={o.id} />
                          <ConfirmSubmit
                            variant="ghost"
                            size="sm"
                            message="Supprimer (ou archiver si des dossiers existent) cet appel ?"
                            className="!px-1.5 !text-muted hover:!text-red-600"
                          >
                            <Icon name="Trash2" size={17} />
                          </ConfirmSubmit>
                        </form>
                      </>
                    ) : null}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState
          icon="Megaphone"
          title="Aucun appel"
          description="Creez votre premier appel a projets, candidatures ou offres."
        >
          {manage ? (
            <Link href="/dashboard/appels/new" className={buttonVariants({})}>
              <Icon name="Plus" size={16} />
              Nouvel appel
            </Link>
          ) : null}
        </EmptyState>
      )}
    </>
  );
}
