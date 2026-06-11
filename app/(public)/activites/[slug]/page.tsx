import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/json";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/ui/rich-text";
import { CoverPlaceholder } from "@/components/ui/cover-placeholder";
import { ACTIVITY_STATUS_META, type ActivityStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getActivity(slug: string) {
  return prisma.activity.findUnique({
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
  const activity = await getActivity(slug);
  if (!activity) return { title: "Activite introuvable" };
  return { title: activity.title, description: activity.excerpt ?? undefined };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivity(slug);
  if (!activity) notFound();

  const meta = ACTIVITY_STATUS_META[activity.status as ActivityStatus];
  const gallery = parseArray(activity.gallery);
  const partners = parseArray(activity.partners);

  return (
    <>
      <PageHeader
        eyebrow="Activite"
        eyebrowIcon="CalendarCheck"
        title={activity.title}
        breadcrumb={[
          { label: "Activites", href: "/activites" },
          { label: activity.title.slice(0, 40) },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          {meta ? <Badge tone={meta.tone}>{meta.label}</Badge> : null}
          {activity.startDate ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Icon name="CalendarDays" size={15} />
              {formatDate(activity.startDate)}
              {activity.endDate ? ` - ${formatDate(activity.endDate)}` : ""}
            </span>
          ) : null}
          {activity.location ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Icon name="MapPin" size={15} />
              {activity.location}
            </span>
          ) : null}
        </div>
      </PageHeader>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <Reveal>
              <div className="overflow-hidden rounded-2xl shadow-card">
                {activity.coverImage ? (
                  <img
                    src={activity.coverImage}
                    alt={activity.title}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <CoverPlaceholder
                    seed={activity.slug}
                    icon="CalendarCheck"
                    className="h-64 w-full"
                  />
                )}
              </div>
            </Reveal>

            <Reveal className="mt-8">
              <h2 className="font-heading text-2xl font-bold">Description</h2>
              <div className="mt-3">
                <RichText content={activity.description} />
              </div>
            </Reveal>

            {activity.objectives ? (
              <Reveal className="mt-8">
                <h3 className="font-heading text-xl font-bold">Objectifs</h3>
                <div className="mt-3">
                  <RichText content={activity.objectives} />
                </div>
              </Reveal>
            ) : null}

            {activity.results ? (
              <Reveal className="mt-8">
                <Card className="bg-ojid-green/[0.04] p-6">
                  <span className="eyebrow">
                    <Icon name="TrendingUp" size={15} /> Resultats
                  </span>
                  <div className="mt-2">
                    <RichText content={activity.results} />
                  </div>
                </Card>
              </Reveal>
            ) : null}

            {gallery.length > 0 ? (
              <Reveal className="mt-8">
                <h3 className="font-heading text-xl font-bold">Galerie</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${activity.title} ${i + 1}`}
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <span className="eyebrow">
                <Icon name="Info" size={15} /> Informations
              </span>
              <dl className="mt-4 space-y-3 text-sm">
                {activity.department ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Departement</dt>
                    <dd className="text-right font-medium text-ink">
                      {activity.department.name}
                    </dd>
                  </div>
                ) : null}
                {meta ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Statut</dt>
                    <dd>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </dd>
                  </div>
                ) : null}
                {activity.location ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Lieu</dt>
                    <dd className="text-right font-medium text-ink">
                      {activity.location}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Card>

            {partners.length > 0 ? (
              <Card className="p-6">
                <span className="eyebrow">
                  <Icon name="Handshake" size={15} /> Partenaires
                </span>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  {partners.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="CircleDot" size={12} className="text-ojid-orange" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <Link
            href="/activites"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ojid-green"
          >
            <Icon name="ArrowLeft" size={16} />
            Retour aux activites
          </Link>
        </Container>
      </Section>
    </>
  );
}
