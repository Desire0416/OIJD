import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EmailsAdminPage() {
  await requireCapability("emails.manage");
  const [templates, logs] = await Promise.all([
    prisma.emailTemplate.findMany({ orderBy: { name: "asc" } }),
    prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
  ]);

  return (
    <>
      <PageTitle title="Emails" description="Modeles d'emails automatiques et journal des envois." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-heading font-bold text-ink">Modeles</h2>
          <div className="space-y-2.5">
            {templates.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/emails/${t.key}/edit`}
                className="flex items-center gap-3 rounded-2xl border border-ojid-gray bg-white p-4 shadow-card transition-shadow hover:shadow-lift"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ojid-green/10 text-ojid-green">
                  <Icon name="Mail" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="truncate text-xs text-muted">{t.subject}</p>
                </div>
                <Badge tone={t.isActive ? "green" : "gray"}>{t.isActive ? "Actif" : "Inactif"}</Badge>
                <Icon name="ChevronRight" size={16} className="text-muted" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-heading font-bold text-ink">Derniers envois</h2>
          <Card className="p-0">
            {logs.length > 0 ? (
              <ul className="divide-y divide-ojid-gray">
                {logs.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 px-4 py-3">
                    <Icon
                      name={l.status === "FAILED" ? "MailWarning" : "MailCheck"}
                      size={17}
                      className={l.status === "FAILED" ? "mt-0.5 text-red-500" : "mt-0.5 text-ojid-green"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{l.subject}</p>
                      <p className="truncate text-xs text-muted">
                        {l.to} • {formatDateTime(l.createdAt)}
                      </p>
                    </div>
                    <Badge tone={l.status === "FAILED" ? "red" : l.status === "SENT" ? "green" : "gray"}>
                      {l.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon="Mail" title="Aucun envoi" description="Le journal des emails apparaitra ici." />
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
