import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

function tone(action: string): "red" | "amber" | "green" | "gray" {
  if (action.includes("DELETED") || action.includes("FAILED")) return "red";
  if (action.includes("CREATED")) return "green";
  if (action.includes("LOGIN") || action.includes("DOWNLOAD")) return "gray";
  return "amber";
}

export default async function AuditPage() {
  await requireCapability("audit.view");
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 150,
    include: { user: { select: { name: true } } },
  });

  return (
    <>
      <PageTitle title="Journal d'audit" description="Tracabilite des actions sensibles sur la plateforme." />

      {logs.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Utilisateur</TH>
              <TH>Action</TH>
              <TH>Entite</TH>
              <TH>Reference</TH>
            </tr>
          </THead>
          <TBody>
            {logs.map((l) => (
              <TR key={l.id}>
                <TD className="whitespace-nowrap text-muted">{formatDateTime(l.createdAt)}</TD>
                <TD className="text-ink">{l.user?.name ?? "Systeme / public"}</TD>
                <TD>
                  <Badge tone={tone(l.action)} dot={false}>
                    {l.action}
                  </Badge>
                </TD>
                <TD className="text-muted">{l.entityType}</TD>
                <TD className="font-mono text-xs text-muted">{l.entityId ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState icon="ScrollText" title="Journal vide" description="Les actions sensibles seront tracees ici." />
      )}
    </>
  );
}
