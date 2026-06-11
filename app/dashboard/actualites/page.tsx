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
import { deleteNews } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const user = await requireCapability("news.create");
  const where =
    isDepartmentScoped(user.role) && user.departmentId
      ? { departmentId: user.departmentId }
      : {};

  const news = await prisma.news.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { department: { select: { name: true } } },
  });

  return (
    <>
      <PageTitle title="Actualites" description="Articles, communiques et publications.">
        <Link href="/dashboard/actualites/new" className={buttonVariants({ size: "sm" })}>
          <Icon name="Plus" size={16} />
          Nouvel article
        </Link>
      </PageTitle>

      {news.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Titre</TH>
              <TH>Statut</TH>
              <TH>Departement</TH>
              <TH>Cree le</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {news.map((n) => (
              <TR key={n.id}>
                <TD className="max-w-[320px]">
                  <Link href={`/dashboard/actualites/${n.id}/edit`} className="font-semibold text-ink hover:text-ojid-green">
                    <span className="line-clamp-1">{n.title}</span>
                  </Link>
                  {n.featured ? <span className="ml-1 text-xs text-ojid-orange">• A la une</span> : null}
                </TD>
                <TD>
                  <StatusBadge kind="publish" value={n.status} />
                </TD>
                <TD className="text-muted">{n.department?.name ?? "-"}</TD>
                <TD className="whitespace-nowrap text-muted">{formatDateShort(n.createdAt)}</TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    {n.status === "PUBLISHED" ? (
                      <Link
                        href={`/actualites/${n.slug}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                        aria-label="Voir"
                      >
                        <Icon name="ExternalLink" size={16} />
                      </Link>
                    ) : null}
                    <Link
                      href={`/dashboard/actualites/${n.id}/edit`}
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Modifier"
                    >
                      <Icon name="Pencil" size={16} />
                    </Link>
                    <form action={deleteNews}>
                      <input type="hidden" name="id" value={n.id} />
                      <ConfirmSubmit
                        variant="ghost"
                        size="sm"
                        message="Supprimer cet article ?"
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
        <EmptyState icon="Newspaper" title="Aucune actualite" description="Publiez votre premiere actualite.">
          <Link href="/dashboard/actualites/new" className={buttonVariants({})}>
            <Icon name="Plus" size={16} /> Nouvel article
          </Link>
        </EmptyState>
      )}
    </>
  );
}
