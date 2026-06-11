import { prisma } from "@/lib/prisma";
import { requireCapability, submissionScopeWhere } from "@/lib/dash-auth";
import {
  OPPORTUNITY_TYPE_META,
  SUBMISSION_STATUS_META,
  type OpportunityType,
  type SubmissionStatus,
} from "@/lib/constants";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const SCORE_BANDS = [
  { label: "90 - 100 % (tres pertinent)", min: 90, tone: "bg-ojid-green" },
  { label: "75 - 89 % (a examiner vite)", min: 75, tone: "bg-ojid-flame" },
  { label: "60 - 74 % (avec attention)", min: 60, tone: "bg-ojid-orange" },
  { label: "40 - 59 % (partiel)", min: 40, tone: "bg-amber-500" },
  { label: "< 40 % (faible)", min: 0, tone: "bg-slate-400" },
];

export default async function StatisticsPage() {
  const user = await requireCapability("stats.view");
  const scope = submissionScopeWhere(user);

  const [
    totalSubs,
    subsByStatus,
    oppByType,
    topOpps,
    scores,
    newsCount,
    activitiesCount,
    partnersCount,
    departmentsCount,
  ] = await Promise.all([
    prisma.submission.count({ where: scope }),
    prisma.submission.groupBy({ by: ["status"], where: scope, _count: true }),
    prisma.opportunity.groupBy({ by: ["type"], _count: true }),
    prisma.opportunity.findMany({
      orderBy: { submissions: { _count: "desc" } },
      take: 6,
      select: { id: true, title: true, _count: { select: { submissions: true } } },
    }),
    prisma.submission.findMany({ where: scope, select: { score: true } }),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.activity.count(),
    prisma.partner.count(),
    prisma.department.count(),
  ]);

  const maxType = Math.max(1, ...oppByType.map((t) => t._count));
  const bands = SCORE_BANDS.map((b, i) => {
    const upper = i === 0 ? 101 : SCORE_BANDS[i - 1].min;
    const count = scores.filter(
      (s) => s.score != null && s.score >= b.min && s.score < upper,
    ).length;
    return { ...b, count };
  });

  return (
    <>
      <PageTitle title="Statistiques" description="Pilotage des appels, dossiers et contenus." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Dossiers recus" value={totalSubs} icon="Inbox" tone="green" />
        <StatCard label="Actualites" value={newsCount} icon="Newspaper" tone="blue" />
        <StatCard label="Activites" value={activitiesCount} icon="CalendarCheck" tone="teal" />
        <StatCard label="Partenaires" value={partnersCount} icon="Handshake" tone="orange" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-heading font-bold text-ink">Dossiers par statut</h2>
          <div className="mt-4 space-y-2.5">
            {subsByStatus
              .sort((a, b) => b._count - a._count)
              .map((s) => {
                const pct = totalSubs ? Math.round((s._count / totalSubs) * 100) : 0;
                return (
                  <div key={s.status} className="flex items-center gap-3 text-sm">
                    <span className="w-40 shrink-0 text-muted">
                      {SUBMISSION_STATUS_META[s.status as SubmissionStatus]?.label ?? s.status}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ojid-gray">
                      <div className="h-full rounded-full bg-ojid-green" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium text-ink">{s._count}</span>
                  </div>
                );
              })}
            {subsByStatus.length === 0 ? <p className="text-sm text-muted">Aucun dossier.</p> : null}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold text-ink">Score de compatibilite</h2>
          <p className="text-sm text-muted">Repartition des dossiers evalues.</p>
          <div className="mt-4 space-y-2.5">
            {bands.map((b) => {
              const pct = totalSubs ? Math.round((b.count / totalSubs) * 100) : 0;
              return (
                <div key={b.label} className="flex items-center gap-3 text-sm">
                  <span className="w-48 shrink-0 text-muted">{b.label}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ojid-gray">
                    <div className={`h-full rounded-full ${b.tone}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right font-medium text-ink">{b.count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold text-ink">Appels par type</h2>
          <div className="mt-4 space-y-2.5">
            {oppByType
              .sort((a, b) => b._count - a._count)
              .map((t) => (
                <div key={t.type} className="flex items-center gap-3 text-sm">
                  <span className="w-44 shrink-0 text-muted">
                    {OPPORTUNITY_TYPE_META[t.type as OpportunityType]?.label ?? t.type}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ojid-gray">
                    <div
                      className="h-full rounded-full bg-ojid-orange"
                      style={{ width: `${Math.round((t._count / maxType) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-ink">{t._count}</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold text-ink">Appels les plus sollicites</h2>
          <ul className="mt-4 space-y-2.5">
            {topOpps.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="line-clamp-1 text-ink">{o.title}</span>
                <span className="shrink-0 rounded-full bg-ojid-green/10 px-2.5 py-0.5 font-semibold text-ojid-green">
                  {o._count.submissions}
                </span>
              </li>
            ))}
            {topOpps.length === 0 ? <li className="text-muted">Aucun appel.</li> : null}
          </ul>
        </Card>
      </div>
    </>
  );
}
