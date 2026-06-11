import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseArray, parseObject } from "@/lib/json";
import {
  OPPORTUNITY_STATUS_META,
  OPPORTUNITY_TYPE_META,
  type OpportunityStatus,
  type OpportunityType,
} from "@/lib/constants";
import { daysUntil, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/ui/rich-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getOpportunity(slug: string) {
  return prisma.opportunity.findUnique({
    where: { slug },
    include: { department: { select: { name: true, slug: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opp = await getOpportunity(slug);
  if (!opp) return { title: "Appel introuvable" };
  return { title: opp.title, description: opp.summary ?? undefined };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = await getOpportunity(slug);
  if (!opp || opp.status === "DRAFT") notFound();

  const typeMeta = OPPORTUNITY_TYPE_META[opp.type as OpportunityType];
  const statusMeta = OPPORTUNITY_STATUS_META[opp.status as OpportunityStatus];
  const requiredDocs = parseArray(opp.requiredDocuments);
  const downloadable = parseArray<{ label?: string; url?: string } | string>(
    opp.downloadableDocs,
  );
  const faq = parseArray<{ q: string; a: string }>(opp.faq);
  const days = daysUntil(opp.deadline);
  const canSubmit = opp.status === "PUBLISHED" && (days === null || days >= 0);

  return (
    <>
      <PageHeader
        eyebrow={typeMeta?.label ?? "Appel"}
        eyebrowIcon={typeMeta?.icon ?? "Megaphone"}
        title={opp.title}
        breadcrumb={[
          { label: "Appels", href: "/appels" },
          { label: opp.title.slice(0, 40) + (opp.title.length > 40 ? "..." : "") },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          {statusMeta ? (
            <Badge tone={statusMeta.tone} dot>
              {statusMeta.label}
            </Badge>
          ) : null}
          {opp.deadline ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Icon name="Clock" size={15} />
              {canSubmit
                ? `Cloture le ${formatDate(opp.deadline)}`
                : `Date limite : ${formatDate(opp.deadline)}`}
            </span>
          ) : null}
          {canSubmit ? (
            <Link
              href={`/appels/${opp.slug}/soumettre`}
              className={buttonVariants({ variant: "primary" })}
            >
              {typeMeta?.actionLabel ?? "Soumettre"}
              <Icon name="ArrowRight" size={18} />
            </Link>
          ) : null}
        </div>
      </PageHeader>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-8">
            {!canSubmit && opp.status !== "RESULTS_PUBLISHED" ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <Icon name="AlertTriangle" size={20} className="mt-0.5 shrink-0" />
                <p className="text-sm">
                  Les soumissions pour cet appel ne sont pas ouvertes
                  {statusMeta ? ` (${statusMeta.label.toLowerCase()})` : ""}. Vous
                  pouvez toujours consulter les details ci-dessous.
                </p>
              </div>
            ) : null}

            {opp.status === "RESULTS_PUBLISHED" && opp.resultsContent ? (
              <Card className="border-violet-200 bg-violet-50/60 p-6">
                <span className="eyebrow !text-violet-700">
                  <Icon name="Award" size={15} /> Resultats publies
                </span>
                <div className="mt-2">
                  <RichText content={opp.resultsContent} />
                </div>
              </Card>
            ) : null}

            {opp.summary ? (
              <Reveal>
                <p className="text-lg font-medium leading-relaxed text-ink">
                  {opp.summary}
                </p>
              </Reveal>
            ) : null}

            <Block title="Contexte" content={opp.context} />
            <Block title="Objectifs" content={opp.objectives} />
            <Block title="Public cible" content={opp.targetAudience} />
            <Block title="Conditions d'eligibilite" content={opp.eligibility} />
            <Block title="Criteres de selection" content={opp.selectionCriteria} />
            <Block title="Calendrier du processus" content={opp.processCalendar} />
            <Block title="Modalites de soumission" content={opp.submissionGuidelines} />

            {faq.length > 0 ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold">
                  Questions frequentes
                </h2>
                <div className="mt-4 space-y-3">
                  {faq.map((f, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-ojid-gray bg-white p-4 [&_summary]:cursor-pointer"
                    >
                      <summary className="flex items-center justify-between gap-3 font-semibold text-ink">
                        {f.q}
                        <Icon
                          name="ChevronDown"
                          size={18}
                          className="shrink-0 text-ojid-green transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-heading text-lg font-bold">Informations cles</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Type" value={typeMeta?.label} />
                <Row label="Departement" value={opp.department?.name} />
                <Row label="Ouverture" value={opp.openingDate ? formatDate(opp.openingDate) : undefined} />
                <Row label="Date limite" value={opp.deadline ? formatDate(opp.deadline) : "Sans echeance"} />
                <Row label="Domaine" value={opp.domain} />
                <Row
                  label="Lieu"
                  value={[opp.city, opp.country].filter(Boolean).join(", ") || undefined}
                />
              </dl>
              {canSubmit ? (
                <Link
                  href={`/appels/${opp.slug}/soumettre`}
                  className={buttonVariants({
                    variant: "primary",
                    className: "mt-5 w-full",
                  })}
                >
                  {typeMeta?.actionLabel ?? "Soumettre"}
                  <Icon name="ArrowRight" size={18} />
                </Link>
              ) : (
                <div className="mt-5 rounded-xl bg-ojid-gray/60 px-4 py-3 text-center text-sm font-medium text-muted">
                  Soumissions closes
                </div>
              )}
            </Card>

            {requiredDocs.length > 0 ? (
              <Card className="p-6">
                <span className="eyebrow">
                  <Icon name="Paperclip" size={15} /> Pieces a fournir
                </span>
                <ul className="mt-3 space-y-2 text-sm">
                  {requiredDocs.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink">
                      <Icon
                        name="FileText"
                        size={16}
                        className="mt-0.5 shrink-0 text-ojid-green"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {downloadable.length > 0 ? (
              <Card className="p-6">
                <span className="eyebrow">
                  <Icon name="Download" size={15} /> Documents a telecharger
                </span>
                <ul className="mt-3 space-y-2 text-sm">
                  {downloadable.map((d, i) => {
                    const label = typeof d === "string" ? d : d.label ?? "Document";
                    const url = typeof d === "string" ? "#" : d.url ?? "#";
                    return (
                      <li key={i}>
                        <a
                          href={url}
                          className="flex items-center gap-2 text-ojid-green hover:underline"
                        >
                          <Icon name="Download" size={16} />
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ) : null}

            {opp.contactInfo ? (
              <Card className="p-6">
                <span className="eyebrow">
                  <Icon name="Mail" size={15} /> Contact
                </span>
                <p className="mt-2 text-sm text-ink">{opp.contactInfo}</p>
              </Card>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Block({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <Reveal>
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
      <div className="mt-3">
        <RichText content={content} />
      </div>
    </Reveal>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3 border-b border-ojid-gray/70 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
