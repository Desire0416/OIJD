import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability, submissionScopeWhere } from "@/lib/dash-auth";
import { isDepartmentScoped } from "@/lib/permissions";
import { DOCUMENT_VISIBILITY, DOCUMENT_VISIBILITY_META } from "@/lib/constants";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { formatBytes, formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DocumentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ visibilite?: string }>;
}) {
  const user = await requireCapability("submissions.view");
  const sp = await searchParams;

  const where: Record<string, unknown> = {};
  if (isDepartmentScoped(user.role) && user.departmentId) {
    where.OR = [
      { departmentId: user.departmentId },
      { opportunity: { departmentId: user.departmentId } },
    ];
  }
  if (sp.visibilite) where.visibility = sp.visibilite;

  const documents = await prisma.document.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      submission: { select: { id: true, reference: true } },
      opportunity: { select: { title: true } },
      news: { select: { title: true } },
      activity: { select: { title: true } },
    },
  });

  return (
    <>
      <PageTitle title="Documents" description="Base documentaire securisee de la plateforme." />

      <form method="GET" className="mb-4 flex items-center gap-2">
        <Select name="visibilite" defaultValue={sp.visibilite ?? ""} className="max-w-xs">
          <option value="">Toutes les confidentialites</option>
          {DOCUMENT_VISIBILITY.map((v) => (
            <option key={v} value={v}>
              {DOCUMENT_VISIBILITY_META[v].label}
            </option>
          ))}
        </Select>
        <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-ojid-green px-4 font-semibold text-white hover:bg-ojid-green-dark">
          <Icon name="Filter" size={16} /> Filtrer
        </button>
      </form>

      {documents.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Fichier</TH>
              <TH>Type</TH>
              <TH>Rattachement</TH>
              <TH>Confidentialite</TH>
              <TH>Taille</TH>
              <TH>Date</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {documents.map((d) => (
              <TR key={d.id}>
                <TD className="max-w-[220px]">
                  <span className="line-clamp-1 font-medium text-ink">{d.originalName}</span>
                </TD>
                <TD className="text-muted">{d.type ?? "-"}</TD>
                <TD className="max-w-[200px] text-muted">
                  {d.submission ? (
                    <Link href={`/dashboard/dossiers/${d.submission.id}`} className="text-ojid-green hover:underline">
                      Dossier {d.submission.reference}
                    </Link>
                  ) : (
                    <span className="line-clamp-1">
                      {d.opportunity?.title ?? d.news?.title ?? d.activity?.title ?? "-"}
                    </span>
                  )}
                </TD>
                <TD>
                  <StatusBadge kind="document" value={d.visibility} dot={false} />
                </TD>
                <TD className="whitespace-nowrap text-muted">{formatBytes(d.sizeBytes)}</TD>
                <TD className="whitespace-nowrap text-muted">{formatDateShort(d.createdAt)}</TD>
                <TD>
                  <a
                    href={`/api/uploads/${d.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-ojid-green"
                  >
                    <Icon name="Download" size={15} />
                  </a>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState icon="FolderOpen" title="Aucun document" description="Les pieces transmises apparaitront ici." />
      )}
    </>
  );
}
