import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser, submissionScopeWhere } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreBadge } from "@/components/dashboard/score-meter";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await requireUser();
  const scope = submissionScopeWhere(user);
  const soon = new Date(Date.now() + 7 * 24 * 3600 * 1000);

  const [
    newsCount,
    activitiesCount,
    openCalls,
    underReview,
    closedCalls,
    totalSubs,
    incompleteSubs,
    preselectedSubs,
    retainedSubs,
    pendingSubs,
    deadlineSoon,
    toValidate,
    recent,
  ] = await Promise.all([
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.activity.count(),
    prisma.opportunity.count({ where: { status: "PUBLISHED" } }),
    prisma.opportunity.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.opportunity.count({ where: { status: "CLOSED" } }),
    prisma.submission.count({ where: scope }),
    prisma.submission.count({ where: { ...scope, status: "INCOMPLETE" } }),
    prisma.submission.count({ where: { ...scope, status: "PRESELECTED" } }),
    prisma.submission.count({
      where: { ...scope, status: { in: ["RETAINED", "FINAL_VALIDATED"] } },
    }),
    prisma.submission.count({
      where: {
        ...scope,
        status: { in: ["RECEIVED", "PENDING_VERIFICATION", "UNDER_REVIEW"] },
      },
    }),
    prisma.opportunity.findMany({
      where: { status: "PUBLISHED", deadline: { lte: soon, gte: new Date() } },
      orderBy: { deadline: "asc" },
      take: 5,
      select: { id: true, title: true, slug: true, deadline: true },
    }),
    can(user.role, "content.validate")
      ? prisma.news.count({ where: { status: "PENDING_REVIEW" } })
      : Promise.resolve(0),
    prisma.submission.findMany({
      where: scope,
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { opportunity: { select: { title: true } } },
    }),
  ]);

  return (
    <>
      <PageTitle
        title={`Bonjour, ${user.name.split(" ")[0]}`}
        description="Vue d'ensemble de la plateforme OIJD - Section CIV."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Dossiers recus" value={totalSubs} icon="Inbox" tone="green" href="/dashboard/dossiers" />
        <StatCard label="Appels ouverts" value={openCalls} icon="Megaphone" tone="orange" href="/dashboard/appels" />
        <StatCard label="Dossiers en attente" value={pendingSubs} icon="Hourglass" tone="amber" href="/dashboard/dossiers?statut=UNDER_REVIEW" />
        <StatCard label="Preselectionnes" value={preselectedSubs} icon="Star" tone="purple" href="/dashboard/dossiers?statut=PRESELECTED" />
        <StatCard label="Actualites publiees" value={newsCount} icon="Newspaper" tone="blue" href="/dashboard/actualites" />
        <StatCard label="Activites" value={activitiesCount} icon="CalendarCheck" tone="teal" href="/dashboard/activites" />
        <StatCard label="Appels en analyse" value={underReview} icon="Search" tone="amber" />
        <StatCard label="Retenus" value={retainedSubs} icon="CheckCircle2" tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Dossiers recents */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ojid-gray px-5 py-4">
            <h2 className="font-heading font-bold text-ink">Dossiers recents</h2>
            <Link href="/dashboard/dossiers" className="text-sm font-semibold text-ojid-green">
              Tout voir
            </Link>
          </div>
          {recent.length > 0 ? (
            <ul className="divide-y divide-ojid-gray">
              {recent.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/dashboard/dossiers/${s.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ojid-gray/30"
                  >
                    <ScoreBadge score={s.score} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {s.title || `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.email}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {s.opportunity.title} • {formatDateShort(s.createdAt)}
                      </p>
                    </div>
                    <StatusBadge kind="submission" value={s.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState icon="Inbox" title="Aucun dossier" description="Les dossiers recus apparaitront ici." />
            </div>
          )}
        </Card>

        {/* Alertes */}
        <Card className="p-5">
          <h2 className="mb-4 font-heading font-bold text-ink">Alertes</h2>
          <div className="space-y-4 text-sm">
            <AlertRow
              icon="AlertTriangle"
              tone="amber"
              label="Dossiers incomplets"
              value={incompleteSubs}
              href="/dashboard/dossiers?statut=INCOMPLETE"
            />
            <AlertRow
              icon="Hourglass"
              tone="blue"
              label="Dossiers a traiter"
              value={pendingSubs}
              href="/dashboard/dossiers"
            />
            {can(user.role, "content.validate") ? (
              <AlertRow
                icon="FileCheck2"
                tone="orange"
                label="Publications a valider"
                value={toValidate}
                href="/dashboard/actualites?statut=PENDING_REVIEW"
              />
            ) : null}
            <AlertRow
              icon="Clock"
              tone="red"
              label="Appels arrivant a echeance"
              value={deadlineSoon.length}
            />
          </div>

          {deadlineSoon.length > 0 ? (
            <div className="mt-5 border-t border-ojid-gray pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Echeances proches
              </p>
              <ul className="space-y-2">
                {deadlineSoon.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-2 text-sm">
                    <Link href={`/dashboard/appels/${o.id}`} className="truncate text-ink hover:text-ojid-green">
                      {o.title}
                    </Link>
                    <span className="shrink-0 text-xs font-medium text-ojid-orange">
                      {formatDate(o.deadline)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}

function AlertRow({
  icon,
  tone,
  label,
  value,
  href,
}: {
  icon: string;
  tone: "amber" | "blue" | "orange" | "red";
  label: string;
  value: number;
  href?: string;
}) {
  const toneClass = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    orange: "bg-ojid-orange/10 text-ojid-orange",
    red: "bg-red-50 text-red-600",
  }[tone];
  const content = (
    <div className="flex items-center gap-3">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon name={icon} size={17} />
      </span>
      <span className="flex-1 text-ink">{label}</span>
      <span className="font-heading text-lg font-bold text-ink">{value}</span>
    </div>
  );
  return href ? (
    <Link href={href} className="block rounded-lg transition-colors hover:bg-ojid-gray/30">
      {content}
    </Link>
  ) : (
    content
  );
}
