import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { parseArray, parseObject } from "@/lib/json";
import {
  OPPORTUNITY_TYPE_META,
  SUBMISSION_STATUS_META,
  type OpportunityType,
  type SubmissionStatus,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreMeter } from "@/components/dashboard/score-meter";
import { DecisionPanel } from "@/components/dashboard/decision-panel";
import { NoteForm } from "@/components/dashboard/note-form";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import type { FormSchema } from "@/lib/submission-types";
import { recomputeScoreForm } from "../actions";

export const dynamic = "force-dynamic";

function humanize(key: string): string {
  const s = key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function DossierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCapability("submissions.view");
  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      opportunity: { select: { id: true, title: true, type: true, formSchema: true, department: { select: { name: true } } } },
      documents: true,
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      emailLogs: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!submission) notFound();

  const canDecide = can(user.role, "submissions.decide");
  const formData = parseObject<Record<string, string>>(submission.formData, {});
  const schema = parseObject<FormSchema>(submission.opportunity.formSchema, { fields: [] });
  const labelMap: Record<string, string> = {};
  schema.fields.forEach((f) => (labelMap[f.name] = f.label));
  const matched = parseArray<string>(submission.matchedCriteria);
  const missing = parseArray<string>(submission.missingCriteria);
  const details = parseArray<{ label: string; weight: number; points: number }>(
    submission.scoreDetails,
  );
  const name =
    submission.title ||
    [submission.firstName, submission.lastName].filter(Boolean).join(" ") ||
    submission.organizationName ||
    submission.email;
  const typeMeta = OPPORTUNITY_TYPE_META[submission.opportunity.type as OpportunityType];

  return (
    <>
      <Link
        href="/dashboard/dossiers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux dossiers
      </Link>

      <PageTitle title={name} description={`Reference ${submission.reference}`}>
        <StatusBadge kind="submission" value={submission.status} />
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          {/* Identite */}
          <Card className="p-5">
            <h3 className="font-heading font-bold text-ink">Identite</h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Info label="Type" value={submission.submitterType === "ORGANIZATION" ? "Organisation" : "Particulier"} />
              <Info label="Email" value={submission.email} />
              <Info label="Telephone" value={submission.phone} />
              <Info label="Pays" value={submission.country} />
              <Info label="Ville" value={submission.city} />
              <Info label="Soumis le" value={formatDateTime(submission.createdAt)} />
            </dl>
          </Card>

          {/* Reponses formulaire */}
          <Card className="p-5">
            <h3 className="font-heading font-bold text-ink">Donnees du formulaire</h3>
            <dl className="mt-3 space-y-3 text-sm">
              {Object.entries(formData)
                .filter(([, v]) => v && String(v).trim())
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {labelMap[k] ?? humanize(k)}
                    </dt>
                    <dd className="mt-0.5 whitespace-pre-wrap text-ink">{String(v)}</dd>
                  </div>
                ))}
              {Object.keys(formData).length === 0 ? (
                <p className="text-muted">Aucune donnee de formulaire.</p>
              ) : null}
            </dl>
          </Card>

          {/* Documents */}
          <Card className="p-5">
            <h3 className="font-heading font-bold text-ink">
              Pieces transmises ({submission.documents.length})
            </h3>
            {submission.documents.length > 0 ? (
              <ul className="mt-3 divide-y divide-ojid-gray">
                {submission.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon name="FileText" size={18} className="shrink-0 text-ojid-green" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{d.originalName}</p>
                        <p className="text-xs text-muted">
                          {d.type} • {formatBytes(d.sizeBytes)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/api/uploads/${d.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-ojid-green hover:underline"
                    >
                      <Icon name="Download" size={15} /> Telecharger
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Aucune piece jointe.</p>
            )}
          </Card>

          {/* Analyse / scoring */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-ink">
                Analyse de compatibilite
              </h3>
              <form action={recomputeScoreForm}>
                <input type="hidden" name="id" value={submission.id} />
                <Button type="submit" variant="ghost" size="sm" icon="TrendingUp">
                  Recalculer
                </Button>
              </form>
            </div>
            <div className="mt-4 max-w-sm">
              <ScoreMeter score={submission.score} />
            </div>
            {submission.recommendationSummary ? (
              <p className="mt-3 rounded-xl bg-ojid-gray/40 p-3 text-sm text-ink">
                {submission.recommendationSummary}
              </p>
            ) : null}

            {details.length > 0 ? (
              <div className="mt-4 space-y-2">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center gap-3 text-sm">
                    <span className="w-44 shrink-0 text-muted">{d.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ojid-gray">
                      <div
                        className="h-full rounded-full bg-ojid-green"
                        style={{ width: `${d.weight ? (d.points / d.weight) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-medium text-ink">
                      {d.points}/{d.weight}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ojid-green">
                  <Icon name="CheckCircle2" size={15} /> Criteres remplis
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {matched.length ? matched.map((m, i) => <li key={i}>• {m}</li>) : <li>-</li>}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                  <Icon name="AlertTriangle" size={15} /> Points d'attention
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {missing.length ? missing.map((m, i) => <li key={i}>• {m}</li>) : <li>-</li>}
                </ul>
              </div>
            </div>
          </Card>

          {/* Notes internes */}
          <Card className="p-5">
            <h3 className="font-heading font-bold text-ink">Notes internes</h3>
            {submission.notes.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {submission.notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-ojid-gray/40 p-3">
                    <p className="text-sm text-ink">{n.content}</p>
                    <p className="mt-1 text-xs text-muted">
                      {n.author?.name ?? "Interne"} • {formatDateTime(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Aucune note pour le moment.</p>
            )}
            <NoteForm id={submission.id} />
          </Card>

          {/* Historique + emails */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-heading font-bold text-ink">Historique</h3>
              <ul className="mt-3 space-y-3">
                {submission.statusHistory.map((h) => (
                  <li key={h.id} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ojid-green" />
                    <div>
                      <StatusBadge kind="submission" value={h.newStatus} dot={false} />
                      {h.comment ? <p className="mt-1 text-xs text-muted">{h.comment}</p> : null}
                      <p className="text-xs text-muted">{formatDateTime(h.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-heading font-bold text-ink">Emails</h3>
              {submission.emailLogs.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {submission.emailLogs.map((e) => (
                    <li key={e.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="MailCheck" size={15} className="text-ojid-green" />
                        <span className="truncate font-medium text-ink">{e.subject}</span>
                      </div>
                      <p className="text-xs text-muted">
                        {e.to} • {e.status} • {formatDateTime(e.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">Aucun email envoye.</p>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {canDecide ? (
            <DecisionPanel id={submission.id} currentStatus={submission.status} />
          ) : (
            <Card className="p-5">
              <p className="text-sm text-muted">
                Vous disposez d'un acces en consultation sur ce dossier.
              </p>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="font-heading font-bold text-ink">Informations</h3>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Appel</dt>
                <dd className="text-right">
                  <Link
                    href={`/dashboard/appels/${submission.opportunity.id}`}
                    className="font-medium text-ojid-green hover:underline"
                  >
                    {submission.opportunity.title}
                  </Link>
                </dd>
              </div>
              <Row label="Type" value={typeMeta?.label} />
              <Row label="Departement" value={submission.opportunity.department?.name} />
              <Row
                label="Complet"
                value={submission.complete ? "Oui" : "Non"}
              />
              <Row label="Score" value={submission.score != null ? `${submission.score}/100 (${submission.scoreLabel})` : "-"} />
              {submission.finalDecision ? (
                <Row label="Decision" value={submission.finalDecision} />
              ) : null}
            </dl>
            <div className="mt-3">
              <Badge tone={submission.complete ? "green" : "amber"}>
                {submission.complete ? "Dossier complet" : "A verifier"}
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-ink">{value || "-"}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value || "-"}</dd>
    </div>
  );
}
