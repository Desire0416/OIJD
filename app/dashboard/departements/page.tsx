import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DepartmentsAdminPage() {
  await requireCapability("departments.manage");
  const [departments, users] = await Promise.all([
    prisma.department.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { users: true } } },
    }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);
  const userName = new Map(users.map((u) => [u.id, u.name]));

  return (
    <>
      <PageTitle title="Departements" description="Structure interne et pages publiques des departements.">
        <Link href="/dashboard/departements/new" className={buttonVariants({ size: "sm" })}>
          <Icon name="Plus" size={16} />
          Nouveau departement
        </Link>
      </PageTitle>

      {departments.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Departement</TH>
              <TH>Responsable</TH>
              <TH>Membres</TH>
              <TH>Statut</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {departments.map((d) => (
              <TR key={d.id}>
                <TD>
                  <Link href={`/dashboard/departements/${d.id}/edit`} className="flex items-center gap-2 font-semibold text-ink hover:text-ojid-green">
                    <Icon name={d.icon || "Building2"} size={17} className="text-ojid-green" />
                    {d.name}
                  </Link>
                </TD>
                <TD className="text-muted">{d.headId ? userName.get(d.headId) ?? "-" : "-"}</TD>
                <TD className="text-muted">{d._count.users}</TD>
                <TD>
                  <Badge tone={d.isActive ? "green" : "gray"}>
                    {d.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/departements/${d.slug}`}
                      target="_blank"
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Voir"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/departements/${d.id}/edit`}
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Modifier"
                    >
                      <Icon name="Pencil" size={16} />
                    </Link>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState icon="Building2" title="Aucun departement" description="Creez le premier departement." />
      )}
    </>
  );
}
