import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  getLatestNews,
  getRecentActivities,
  getOpenOpportunities,
  getActivePartners,
  getPublicStats,
  countOpenOpportunities,
} from "@/lib/queries";
import { missions } from "@/lib/site-config";

import { Hero } from "@/components/public/hero";
import { NewsTicker } from "@/components/public/news-ticker";
import { PresidentWord } from "@/components/public/president-word";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { FeatureCard } from "@/components/public/feature-card";
import { NewsCard } from "@/components/public/news-card";
import { ActivityCard } from "@/components/public/activity-card";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { PartnerCard } from "@/components/public/partner-card";
import { StatsGrid } from "@/components/public/stats-grid";
import { CtaBand } from "@/components/public/cta-band";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    news,
    activities,
    opportunities,
    partners,
    stats,
    openCalls,
    departments,
    tickerNews,
  ] = await Promise.all([
    getLatestNews(2),
    getRecentActivities(2),
    getOpenOpportunities(3),
    getActivePartners(10),
    getPublicStats(),
    countOpenOpportunities(),
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, icon: true },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 8,
      select: { title: true, slug: true, category: true },
    }),
  ]);

  return (
    <>
      <Hero openCalls={openCalls} />

      {/* Bandeau d'actualites defilant */}
      <NewsTicker items={tickerNews} />

      {/* Presentation & missions */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="L'organisation"
              eyebrowIcon="Globe2"
              title="L'OIJD - Section Cote d'Ivoire"
              description="Nous federerons une jeunesse engagee autour de la diplomatie, de la cooperation internationale et du leadership responsable."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {missions.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.08}>
                <FeatureCard
                  icon={m.icon}
                  title={m.title}
                  description={m.description}
                  accent={i % 2 === 0 ? "green" : "orange"}
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-8 flex justify-center">
              <Link href="/a-propos" className={buttonVariants({ variant: "outline" })}>
                En savoir plus sur l'OIJD
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Mot du president */}
      <PresidentWord />

      {/* Chiffres cles */}
      <Section>
        <Container>
          <StatsGrid stats={stats} />
        </Container>
      </Section>

      {/* Appels ouverts — 3 en vedette */}
      {opportunities.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Centre des appels & opportunites"
                  eyebrowIcon="Megaphone"
                  title="Opportunites ouvertes"
                  description={`${openCalls} appel${openCalls > 1 ? "s" : ""} ouvert${openCalls > 1 ? "s" : ""} en ce moment — projets, candidatures, stages, volontariats et plus.`}
                />
                <Link
                  href="/appels"
                  className={buttonVariants({ variant: "primary", size: "sm" })}
                >
                  Voir tous les appels
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o, i) => (
                <Reveal key={o.id} delay={i * 0.07}>
                  <OpportunityCard opp={o} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Dernieres actualites — 2 en vedette */}
      {news.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Actualites"
                  eyebrowIcon="Newspaper"
                  title="Dernieres nouvelles"
                  description="Les communiques, evenements et publications recents de l'OIJD."
                />
                <Link
                  href="/actualites"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Toutes les actualites
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {news.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.07}>
                  <NewsCard news={n} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Activites recentes — 2 en vedette */}
      {activities.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Sur le terrain"
                  eyebrowIcon="CalendarCheck"
                  title="Activites recentes"
                  description="Un apercu des actions menees par nos departements et nos membres."
                />
                <Link
                  href="/activites"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Toutes les activites
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {activities.map((a, i) => (
                <Reveal key={a.id} delay={i * 0.07}>
                  <ActivityCard activity={a} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Departements — chips compacts (toute la liste, version legere) */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Notre structure"
                eyebrowIcon="Building2"
                title="Nos departements"
                description="Une organisation structuree autour de departements et de responsables identifies."
              />
              <Link
                href="/departements"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Explorer les departements
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {departments.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.04}>
                <Link
                  href={`/departements/${d.slug}`}
                  className="group flex items-center gap-2.5 rounded-xl border border-ojid-gray bg-white p-3 text-sm font-medium text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-ojid-green/30 hover:shadow-lift"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ojid-green/10 text-ojid-green transition-colors group-hover:bg-ojid-green group-hover:text-white">
                    <Icon name={d.icon || "Building2"} size={16} />
                  </span>
                  <span className="line-clamp-2 leading-snug">{d.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Partenaires */}
      {partners.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Ils nous accompagnent"
                eyebrowIcon="Handshake"
                title="Nos partenaires"
                description="Institutions, ONG et organisations qui soutiennent la jeunesse diplomatique."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PartnerCard partner={p} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="mt-8 flex justify-center">
                <Link href="/partenaires" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Tous nos partenaires
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* CTA */}
      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
