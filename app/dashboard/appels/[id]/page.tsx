import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import {
  OPPORTUNITY_TYPE_META,
  SUBMISSION_STATUS_META,
  type OpportunityType,
  type SubmissionStatus,
} from "@/lib/constants";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreBadge } from "@/components/dashboard/score-meter";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/dashboard/confirm-submit";
import { formatDate, formatDateShort } from "@/lib/utils";
import { deleteOpportunity } from "../actions";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCapability("submissions.view");
  const { id } = await params;
  const manage = can(user.role, "opportunities.manage");

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      department: { select: { name: true } },
      _count: { select: { submissions: true } },
    },
  });
  if (!opp) notFound();

  const [grouped, recent] = await Promise.all([
    prisma.submission.groupBy({
      by: ["status"],
      where: { opportunityId: id },
      _count: true,
    }),
    prisma.submission.findMany({
      where: { opportunityId: id },
      orderBy: { score: "desc" },
      take: 5,
    }),
  ]);

  const total = opp._count.submissions;
  const byStatus = new Map(grouped.map((g) => [g.status, g._count]));
  const count = (s: SubmissionStatus) => byStatus.get(s) ?? 0;
  const typeMeta = OPPORTUNITY_TYPE_META[opp.type as OpportunityType];

  return (
    <>
      <Link
        href="/dashboard/appels"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux appels
      </Link>

      <PageTitle title={opp.title} description={typeMeta?.label}>
        <Link
          href={`/appels/${opp.slug}`}
          target="_blank"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Icon name="ExternalLink" size={15} />
          Voir en public
        </Link>
        <Link href={`/dashboard/dossiers?appel=${opp.id}`} className={buttonVariants({ size: "sm" })}>
          <Icon name="Inbox" size={15} />
          Dossiers ({total})
        </Link>
        {manage ? (
          <Link
            href={`/dashboard/appels/${opp.id}/edit`}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <Icon name="Pencil" size={15} />
            Modifier
          </Link>
        ) : null}
      </PageTitle>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge kind="opportunity" value={opp.status} />
        {opp.department ? <Badge tone="gray">{opp.department.name}</Badge> : null}
        {opp.deadline ? (
          <span className="text-sm text-muted">
            <Icon name="Clock" size={14} className="mr-1 inline" />
            Echeance : {formatDate(opp.deadline)}
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Dossiers recus" value={total} icon="Inbox" tone="green" />
        <StatCard label="En analyse" value={count("UNDER_REVIEW")} icon="Search" tone="amber" />
        <StatCard label="Preselectionnes" value={count("PRESELECTED")} icon="Star" tone="purple" />
        <StatCard
          label="Retenus"
          value={count("RETAINED") + count("FINAL_VALIDATED")}
          icon="CheckCircle2"
          tone="green"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-heading font-bold text-ink">Repartition des dossiers</h3>
          {grouped.length > 0 ? (
            <div className="mt-4 space-y-2.5">
              {grouped
                .sort((a, b) => b._count - a._count)
                .map((g) => {
                  const meta = SUBMISSION_STATUS_META[g.status as SubmissionStatus];
                  const pct = total ? Math.round((g._count / total) * 100) : 0;
                  return (
                    <div key={g.status} className="flex items-center gap-3 text-sm">
                      <span className="w-40 shrink-0">
                        <StatusBadge kind="submission" value={g.status} dot={false} />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ojid-gray">
                        <div className="h-full rounded-full bg-ojid-green" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 text-right font-medium text-ink">{g._count}</span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Aucun dossier recu pour le moment.</p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-ink">Meilleurs scores</h3>
            <Link href={`/dashboard/dossiers?appel=${opp.id}&sort=score`} className="text-sm font-semibold text-ojid-green">
              Tout voir
            </Link>
          </div>
          {recent.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recent.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/dashboard/dossiers/${s.id}`}
                    className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-ojid-gray/40"
                  >
                    <ScoreBadge score={s.score} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {s.title || s.email}
                      </p>
                      <p className="text-xs text-muted">{formatDateShort(s.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">-</p>
          )}
        </Card>
      </div>

      {manage ? (
        <div className="mt-6 flex justify-end">
          <form action={deleteOpportunity}>
            <input type="hidden" name="id" value={opp.id} />
            <ConfirmSubmit
              variant="ghost"
              size="sm"
              message="Supprimer (ou archiver si des dossiers existent) cet appel ?"
              className="!text-red-600 hover:!bg-red-50"
              icon="Trash2"
            >
              Supprimer cet appel
            </ConfirmSubmit>
          </form>
        </div>
      ) : null}
    </>
  );
}
