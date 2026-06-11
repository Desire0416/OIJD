import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability, submissionScopeWhere } from "@/lib/dash-auth";
import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import { PageTitle } from "@/components/dashboard/page-title";
import { DossierFilters } from "@/components/dashboard/dossier-filters";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreBadge } from "@/components/dashboard/score-meter";
import { Table, THead, TH, TBody, TR, TD } from "@/components/dashboard/table";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateShort, pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

const THRESHOLD = Number(process.env.SMART_SCORING_THRESHOLD || "30");
const TERMINAL = ["REJECTED", "ARCHIVED", "FINAL_VALIDATED"];

export default async function DossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string; appel?: string; sort?: string }>;
}) {
  const user = await requireCapability("submissions.view");
  const sp = await searchParams;
  const scope = submissionScopeWhere(user);

  const where: Record<string, unknown> = { ...scope };
  if (sp.statut) where.status = sp.statut;
  if (sp.appel) where.opportunityId = sp.appel;

  const orderBy =
    sp.sort === "score"
      ? [{ score: "desc" as const }]
      : sp.sort === "oldest"
        ? [{ createdAt: "asc" as const }]
        : [{ createdAt: "desc" as const }];

  const [rows, opportunities, appel] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy,
      take: 300,
      include: { opportunity: { select: { id: true, title: true, type: true } } },
    }),
    prisma.opportunity.findMany({
      where: scope.opportunity ? scope.opportunity : {},
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
    sp.appel
      ? prisma.opportunity.findUnique({
          where: { id: sp.appel },
          select: { id: true, title: true, type: true },
        })
      : null,
  ]);

  const q = (sp.q ?? "").trim().toLowerCase();
  const list = q
    ? rows.filter((r) =>
        `${r.firstName ?? ""} ${r.lastName ?? ""} ${r.organizationName ?? ""} ${r.email} ${r.reference} ${r.title ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : rows;

  // Presynthese : si un appel concentre >= seuil dossiers, proposer les
  // dossiers recommandes pour examen prioritaire (decision humaine conservee).
  let recommended: typeof list = [];
  if (appel) {
    const appelCount = await prisma.submission.count({
      where: { ...scope, opportunityId: appel.id },
    });
    if (appelCount >= THRESHOLD) {
      recommended = [...rows]
        .filter((r) => !TERMINAL.includes(r.status) && (r.score ?? 0) >= 60)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 8);
    }
  }
  const isCandidacy =
    appel && OPPORTUNITY_TYPE_META[appel.type as OpportunityType]?.formCategory === "CANDIDACY";

  const exportHref = `/api/export/dossiers${sp.appel ? `?appel=${sp.appel}` : ""}`;

  return (
    <>
      <PageTitle
        title="Dossiers"
        description="Tri rapide, filtres et presynthese des dossiers recus."
      >
        <Link href={exportHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Icon name="Download" size={16} />
          Exporter CSV
        </Link>
      </PageTitle>

      <DossierFilters opportunities={opportunities} current={sp} />

      {recommended.length > 0 ? (
        <Card className="mt-6 border-ojid-orange/30 bg-ojid-orange/[0.04] p-5">
          <div className="flex items-center gap-2">
            <Icon name="Star" size={18} className="text-ojid-orange" />
            <h2 className="font-heading font-bold text-ink">
              {isCandidacy
                ? "Profils recommandes pour examen prioritaire"
                : "Dossiers recommandes pour examen prioritaire"}
            </h2>
            <Badge tone="orange" className="ml-1">
              Aide a l'analyse
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Classement par score de compatibilite. La decision finale reste humaine.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommended.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/dossiers/${r.id}`}
                className="flex items-center gap-3 rounded-xl border border-ojid-gray bg-white p-3 transition-colors hover:border-ojid-orange/40"
              >
                <ScoreBadge score={r.score} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {r.title || `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || r.email}
                  </p>
                  <p className="truncate text-xs text-muted">{r.scoreLabel}</p>
                </div>
                <StatusBadge kind="submission" value={r.status} dot={false} />
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <p className="mt-6 text-sm text-muted">
        <strong className="text-ink">{list.length}</strong>{" "}
        {pluralize(list.length, "dossier", "dossiers")}
      </p>

      {list.length > 0 ? (
        <div className="mt-3">
          <Table>
            <THead>
              <tr>
                <TH>Score</TH>
                <TH>Candidat / Objet</TH>
                <TH>Appel</TH>
                <TH>Statut</TH>
                <TH>Recu le</TH>
                <TH />
              </tr>
            </THead>
            <TBody>
              {list.map((r) => (
                <TR key={r.id}>
                  <TD>
                    <ScoreBadge score={r.score} />
                  </TD>
                  <TD>
                    <p className="font-semibold text-ink">
                      {r.title || `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || r.email}
                    </p>
                    <p className="text-xs text-muted">{r.reference}</p>
                  </TD>
                  <TD className="max-w-[220px]">
                    <span className="line-clamp-1 text-muted">{r.opportunity.title}</span>
                  </TD>
                  <TD>
                    <StatusBadge kind="submission" value={r.status} />
                  </TD>
                  <TD className="whitespace-nowrap text-muted">
                    {formatDateShort(r.createdAt)}
                  </TD>
                  <TD>
                    <Link
                      href={`/dashboard/dossiers/${r.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-ojid-green"
                    >
                      Voir <Icon name="ChevronRight" size={15} />
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          className="mt-6"
          icon="Inbox"
          title="Aucun dossier"
          description="Aucun dossier ne correspond a ces criteres."
        />
      )}
    </>
  );
}
