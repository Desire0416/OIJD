import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/dashboard/confirm-submit";
import { initials } from "@/lib/utils";
import { deactivateUser } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const me = await requireCapability("users.manage");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { department: { select: { name: true } } },
  });

  return (
    <>
      <PageTitle title="Utilisateurs & roles" description="Comptes internes, roles et permissions.">
        <Link href="/dashboard/utilisateurs/new" className={buttonVariants({ size: "sm" })}>
          <Icon name="Plus" size={16} />
          Nouvel utilisateur
        </Link>
      </PageTitle>

      <Table>
        <THead>
          <tr>
            <TH>Utilisateur</TH>
            <TH>Role</TH>
            <TH>Departement</TH>
            <TH>Statut</TH>
            <TH />
          </tr>
        </THead>
        <TBody>
          {users.map((u) => (
            <TR key={u.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ojid-green/10 text-sm font-bold text-ojid-green">
                    {initials(u.name)}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">
                      {u.name}
                      {u.id === me.id ? <span className="ml-1 text-xs text-muted">(vous)</span> : null}
                    </p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </div>
                </div>
              </TD>
              <TD>
                <StatusBadge kind="role" value={u.role} dot={false} />
              </TD>
              <TD className="text-muted">{u.department?.name ?? "-"}</TD>
              <TD>
                <StatusBadge kind="user" value={u.status} />
              </TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/dashboard/utilisateurs/${u.id}/edit`}
                    className="rounded-lg p-1.5 text-muted hover:bg-ojid-gray hover:text-ink"
                    aria-label="Modifier"
                  >
                    <Icon name="Pencil" size={16} />
                  </Link>
                  {u.id !== me.id && u.status !== "SUSPENDED" ? (
                    <form action={deactivateUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmSubmit
                        variant="ghost"
                        size="sm"
                        message="Suspendre ce compte ?"
                        className="!px-1.5 !text-muted hover:!text-red-600"
                      >
                        <Icon name="UserX" size={16} />
                      </ConfirmSubmit>
                    </form>
                  ) : null}
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  );
}
