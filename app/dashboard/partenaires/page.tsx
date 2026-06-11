import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/dashboard/confirm-submit";
import { EmptyState } from "@/components/ui/empty-state";
import { deletePartner } from "./actions";

export const dynamic = "force-dynamic";

export default async function PartnersAdminPage() {
  await requireCapability("partners.manage");
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <PageTitle title="Partenaires" description="Institutions et organisations partenaires.">
        <Link href="/dashboard/partenaires/new" className={buttonVariants({ size: "sm" })}>
          <Icon name="Plus" size={16} />
          Nouveau partenaire
        </Link>
      </PageTitle>

      {partners.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Partenaire</TH>
              <TH>Type</TH>
              <TH>Statut</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {partners.map((p) => (
              <TR key={p.id}>
                <TD>
                  <Link href={`/dashboard/partenaires/${p.id}/edit`} className="font-semibold text-ink hover:text-ojid-green">
                    {p.name}
                  </Link>
                </TD>
                <TD className="text-muted">{p.partnershipType ?? "-"}</TD>
                <TD>
                  <Badge tone={p.isActive ? "green" : "gray"}>{p.isActive ? "Actif" : "Inactif"}</Badge>
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/dashboard/partenaires/${p.id}/edit`}
                      className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                      aria-label="Modifier"
                    >
                      <Icon name="Pencil" size={16} />
                    </Link>
                    <form action={deletePartner}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit
                        variant="ghost"
                        size="sm"
                        message="Supprimer ce partenaire ?"
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
        <EmptyState icon="Handshake" title="Aucun partenaire" description="Ajoutez vos partenaires institutionnels.">
          <Link href="/dashboard/partenaires/new" className={buttonVariants({})}>
            <Icon name="Plus" size={16} /> Nouveau partenaire
          </Link>
        </EmptyState>
      )}
    </>
  );
}
