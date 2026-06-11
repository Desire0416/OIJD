import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/json";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { NewsCard } from "@/components/public/news-card";
import { ActivityCard } from "@/components/public/activity-card";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { PersonCard } from "@/components/public/person-card";

export const dynamic = "force-dynamic";

async function getDepartment(slug: string) {
  return prisma.department.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartment(slug);
  if (!dept) return { title: "Departement introuvable" };
  return {
    title: dept.name,
    description: dept.shortDescription ?? `Departement ${dept.name} de l'OIJD.`,
  };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartment(slug);
  if (!dept || !dept.isActive) notFound();

  const [head, news, activities, opportunities] = await Promise.all([
    dept.headId
      ? prisma.user.findUnique({
          where: { id: dept.headId },
          include: { department: { select: { name: true } } },
        })
      : null,
    prisma.news.findMany({
      where: { departmentId: dept.id, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { department: { select: { name: true } } },
    }),
    prisma.activity.findMany({
      where: { departmentId: dept.id, status: { not: "ARCHIVED" } },
      orderBy: { startDate: "desc" },
      take: 3,
      include: { department: { select: { name: true } } },
    }),
    prisma.opportunity.findMany({
      where: {
        departmentId: dept.id,
        status: { in: ["PUBLISHED", "SCHEDULED", "UNDER_REVIEW", "RESULTS_PUBLISHED"] },
      },
      orderBy: { deadline: "asc" },
      take: 3,
      include: { department: { select: { name: true } } },
    }),
  ]);

  const responsibilities = parseArray(dept.responsibilities);

  return (
    <>
      <PageHeader
        eyebrow="Departement"
        eyebrowIcon={dept.icon ?? "Building2"}
        title={dept.name}
        description={dept.shortDescription ?? undefined}
        breadcrumb={[
          { label: "Departements", href: "/departements" },
          { label: dept.name },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div>
            {dept.description ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold">Presentation</h2>
                <p className="mt-3 leading-relaxed text-muted">{dept.description}</p>
              </Reveal>
            ) : null}

            {dept.mission ? (
              <Reveal className="mt-8">
                <Card className="bg-ojid-green/[0.04] p-6">
                  <span className="eyebrow">
                    <Icon name="Target" size={15} /> Mission
                  </span>
                  <p className="mt-2 leading-relaxed text-ink">{dept.mission}</p>
                </Card>
              </Reveal>
            ) : null}

            {responsibilities.length > 0 ? (
              <Reveal className="mt-8">
                <h3 className="font-heading text-xl font-bold">Attributions</h3>
                <ul className="mt-4 space-y-3">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon
                        name="CheckCircle2"
                        size={20}
                        className="mt-0.5 shrink-0 text-ojid-green"
                      />
                      <span className="text-ink">{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <div className="space-y-6">
            {head ? (
              <Reveal>
                <div>
                  <span className="eyebrow">
                    <Icon name="Users" size={15} /> Responsable
                  </span>
                  <div className="mt-3">
                    <PersonCard person={head} />
                  </div>
                </div>
              </Reveal>
            ) : null}
            {dept.publicEmail ? (
              <Reveal delay={0.1}>
                <Card className="p-6">
                  <span className="eyebrow">
                    <Icon name="Mail" size={15} /> Contact
                  </span>
                  <a
                    href={`mailto:${dept.publicEmail}`}
                    className="mt-3 flex items-center gap-2 font-semibold text-ojid-green hover:underline"
                  >
                    <Icon name="Mail" size={16} />
                    {dept.publicEmail}
                  </a>
                </Card>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      {opportunities.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Centre des appels"
                eyebrowIcon="Megaphone"
                title="Appels du departement"
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o, i) => (
                <Reveal key={o.id} delay={i * 0.06}>
                  <OpportunityCard opp={o} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {activities.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Sur le terrain"
                eyebrowIcon="CalendarCheck"
                title="Activites du departement"
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a, i) => (
                <Reveal key={a.id} delay={i * 0.06}>
                  <ActivityCard activity={a} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {news.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Actualites"
                eyebrowIcon="Newspaper"
                title="Actualites liees"
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.06}>
                  <NewsCard news={n} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <Link
            href="/departements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ojid-green"
          >
            <Icon name="ArrowLeft" size={16} />
            Retour aux departements
          </Link>
        </Container>
      </Section>
    </>
  );
}
