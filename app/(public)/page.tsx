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
import { coreValues, missions } from "@/lib/site-config";

import { Hero } from "@/components/public/hero";
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
import { DepartmentCard } from "@/components/public/department-card";
import { PartnerCard } from "@/components/public/partner-card";
import { StatsGrid } from "@/components/public/stats-grid";
import { CtaBand } from "@/components/public/cta-band";
import { PresidentWord } from "@/components/public/president-word";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [news, activities, opportunities, partners, stats, openCalls, departments] =
    await Promise.all([
      getLatestNews(3),
      getRecentActivities(3),
      getOpenOpportunities(6),
      getActivePartners(10),
      getPublicStats(),
      countOpenOpportunities(),
      prisma.department.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        take: 8,
      }),
    ]);

  return (
    <>
      <Hero openCalls={openCalls} />

      {/* Presentation & missions */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="L'organisation"
              eyebrowIcon="Globe2"
              title="L'OIJD - Section Cote d'Ivoire"
              description="L'Organisation Internationale de la Jeunesse Diplomatique federe une jeunesse engagee autour de la diplomatie, de la cooperation internationale et du leadership responsable. La Section CIV ancre cette dynamique en Cote d'Ivoire."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </Container>
      </Section>

      {/* Mot du president */}
      <PresidentWord />

      {/* Valeurs */}
      <Section muted>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Ce qui nous anime"
              eyebrowIcon="Heart"
              title="Nos valeurs"
              description="Six valeurs guident chacune de nos actions et de nos engagements."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <FeatureCard
                  icon={v.icon}
                  title={v.title}
                  description={v.description}
                  accent={i % 2 === 0 ? "green" : "orange"}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Departements */}
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
                Tous les departements
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.05}>
                <DepartmentCard dept={d} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Appels ouverts */}
      <Section muted>
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Centre des appels & opportunites"
                eyebrowIcon="Megaphone"
                title="Appels ouverts"
                description="Appels a projets, candidatures, offres, concours et programmes ouverts a la jeunesse."
              />
              <Link
                href="/appels"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                Tous les appels
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
          {opportunities.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o, i) => (
                <Reveal key={o.id} delay={i * 0.06}>
                  <OpportunityCard opp={o} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              icon="Megaphone"
              title="Aucun appel ouvert pour le moment"
              description="Revenez bientot : de nouvelles opportunites sont publiees regulierement."
            />
          )}
        </Container>
      </Section>

      {/* Actualites */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Actualites"
                eyebrowIcon="Newspaper"
                title="Dernieres actualites"
                description="Suivez les communiques, evenements et comptes rendus de l'OIJD."
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
          {news.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.06}>
                  <NewsCard news={n} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              icon="Newspaper"
              title="Pas encore d'actualites"
              description="Les premieres publications arriveront tres prochainement."
            />
          )}
        </Container>
      </Section>

      {/* Activites */}
      {activities.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Sur le terrain"
                  eyebrowIcon="CalendarCheck"
                  title="Activites recentes"
                  description="Decouvrez les actions menees par nos departements et nos membres."
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
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a, i) => (
                <Reveal key={a.id} delay={i * 0.06}>
                  <ActivityCard activity={a} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Chiffres cles */}
      <Section>
        <Container>
          <StatsGrid stats={stats} />
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
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PartnerCard partner={p} />
                </Reveal>
              ))}
            </div>
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
