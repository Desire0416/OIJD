import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { isDepartmentScoped } from "@/lib/permissions";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/dashboard/confirm-submit";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateShort } from "@/lib/utils";
import { deleteActivity } from "./actions";

export const dynamic = "force-dynamic";

export default async function ActivitiesAdminPage() {
  const user = await requireCapability("activities.create");
  const where =
    isDepartmentScoped(user.role) && user.departmentId
      ? { departmentId: user.departmentId }
      : {};

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { department: { select: { name: true } } },
  });

  return (
    <>
      <PageTitle title="Activites & projets" description="Evenements, projets et initiatives de l'OIJD.">
        <Link href="/dashboard/activites/new" className={buttonVariants({ size: "sm" })}>
          <Icon name="Plus" size={16} />
          Nouvelle activite
        </Link>
      </PageTitle>

      {activities.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Titre</TH>
              <TH>Statut</TH>
              <TH>Departement</TH>
              <TH>Date</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {activities.map((a) => (
              <TR key={a.id}>
                <TD className="max-w-[320px]">
                  <Link href={`/dashboard/activites/${a.id}/edit`} className="font-semibold text-ink hover:text-ojid-green">
                    <span className="line-clamp-1">{a.title}</span>
                  </Link>
                </TD>
                <TD>
                  <StatusBadge kind="activity" value={a.status} />
                </TD>
                <TD className="text-muted">{a.department?.name ?? "-"}</TD>
                <TD className="whitespace-nowrap text-muted">
                  {a.startDate ? formatDateShort(a.startDate) : "-"}
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/activites/${a.slug}`}
                      target="_blank"
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Voir"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/activites/${a.id}/edit`}
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Modifier"
                    >
                      <Icon name="Pencil" size={16} />
                    </Link>
                    <form action={deleteActivity}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmSubmit
                        variant="ghost"
                        size="sm"
                        message="Supprimer cette activite ?"
                        className="!px-1.5 !text-muted hover:!text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState icon="CalendarCheck" title="Aucune activite" description="Ajoutez votre premiere activite.">
          <Link href="/dashboard/activites/new" className={buttonVariants({})}>
            <Icon name="Plus" size={16} /> Nouvelle activite
          </Link>
        </EmptyState>
      )}
    </>
  );
}
