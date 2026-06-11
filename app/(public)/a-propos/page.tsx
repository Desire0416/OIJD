import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { FeatureCard } from "@/components/public/feature-card";
import { buttonVariants } from "@/components/ui/button";
import { coreValues, missions, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Decouvrez l'OIJD - Section CIV : histoire, vision, mission, valeurs et domaines d'intervention.",
};

const interventions = [
  { icon: "Handshake", label: "Diplomatie & cooperation" },
  { icon: "Feather", label: "Culture de la paix" },
  { icon: "Star", label: "Leadership des jeunes" },
  { icon: "GraduationCap", label: "Formation & capacites" },
  { icon: "Megaphone", label: "Plaidoyer & sensibilisation" },
  { icon: "Globe2", label: "Relations internationales" },
];

const engagements = [
  "Agir avec ethique, transparence et responsabilite institutionnelle.",
  "Placer la jeunesse au coeur de la diplomatie et du developpement.",
  "Favoriser le dialogue, la paix et la cooperation entre les peuples.",
  "Garantir l'equite et l'inclusion dans tous nos processus.",
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="Notre identite"
        eyebrowIcon="Globe2"
        title="A propos de l'OIJD - Section CIV"
        description="Une jeunesse engagee pour la diplomatie, la cooperation et le leadership responsable."
        breadcrumb={[{ label: "A propos" }]}
      />

      {/* Histoire + vision */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">
              <Icon name="ScrollText" size={15} /> Notre histoire
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold">
              Une organisation au service de la jeunesse diplomatique
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted">
              <p>
                L'Organisation Internationale de la Jeunesse Diplomatique (OIJD)
                rassemble une jeunesse convaincue que la diplomatie, le dialogue
                et la cooperation sont des leviers essentiels de paix et de
                developpement.
              </p>
              <p>
                La Section CIV ancre cette dynamique en Cote d'Ivoire, en
                structurant son action autour de departements, de responsables
                et de programmes concrets au service des jeunes, des partenaires
                et des institutions.
              </p>
              <p>
                Au-dela de la sensibilisation, l'OIJD agit : formation,
                accompagnement de projets, mobilisation citoyenne et promotion du
                leadership responsable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="bg-gradient-to-br from-ojid-green to-ojid-green-dark p-6 text-white">
                <Icon name="Target" size={26} className="text-ojid-orange-flame" />
                <h3 className="mt-3 font-heading text-lg font-bold">Vision</h3>
                <p className="mt-2 text-sm text-white/85">
                  Faire de la jeunesse un acteur central de la diplomatie, de la
                  paix et de la cooperation internationale.
                </p>
              </Card>
              <Card className="p-6">
                <Icon name="Flag" size={26} className="text-ojid-orange" />
                <h3 className="mt-3 font-heading text-lg font-bold">Mission</h3>
                <p className="mt-2 text-sm text-muted">
                  Former, mobiliser et accompagner les jeunes engages pour un
                  avenir responsable et solidaire.
                </p>
              </Card>
              <Card className="p-6 sm:col-span-2">
                <Icon name="HeartHandshake" size={26} className="text-ojid-green" />
                <h3 className="mt-3 font-heading text-lg font-bold">
                  Engagement citoyen
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Encourager la participation active des jeunes aux grands enjeux
                  de societe, de paix et de gouvernance.
                </p>
              </Card>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Missions */}
      <Section muted>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Nos missions"
              eyebrowIcon="Rocket"
              title="Ce que nous faisons"
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

      {/* Domaines d'intervention */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Sur le terrain"
              eyebrowIcon="Layers"
              title="Domaines d'intervention"
              description="Nos actions couvrent un large spectre, de la diplomatie a la formation."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interventions.map((it, i) => (
              <Reveal key={it.label} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl border border-ojid-gray bg-white p-4 shadow-sm transition-colors hover:border-ojid-green/30">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ojid-green/10 text-ojid-green">
                    <Icon name={it.icon} size={20} />
                  </span>
                  <span className="font-semibold text-ink">{it.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Mot de la presidence */}
      <Section muted>
        <Container>
          <Reveal>
            <Card className="relative overflow-hidden p-8 md:p-12">
              <Icon
                name="Quote"
                size={120}
                className="pointer-events-none absolute -right-4 -top-6 text-ojid-green/5"
              />
              <span className="eyebrow">
                <Icon name="Quote" size={15} /> Mot de la presidence
              </span>
              <blockquote className="mt-4 max-w-3xl font-heading text-xl font-semibold leading-relaxed text-ink md:text-2xl">
                « La jeunesse n'est pas seulement l'avenir : elle est une force du
                present. A l'OIJD, nous croyons en une diplomatie portee par des
                jeunes engages, responsables et ouverts au monde. »
              </blockquote>
              <p className="mt-5 font-semibold text-ojid-green">
                La Presidence - OIJD Section CIV
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* Valeurs + engagements */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Nos valeurs"
              eyebrowIcon="Heart"
              title="Ce qui nous anime"
            />
            <div className="mt-8 space-y-4">
              {coreValues.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ojid-orange/10 text-ojid-orange">
                    <Icon name={v.icon} size={18} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{v.title}</h3>
                    <p className="text-sm text-muted">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="Nos principes"
              eyebrowIcon="ShieldCheck"
              title="Nos engagements"
            />
            <ul className="mt-8 space-y-4">
              {engagements.map((e) => (
                <li
                  key={e}
                  className="flex items-start gap-3 rounded-xl border border-ojid-gray bg-white p-4"
                >
                  <Icon
                    name="CheckCircle2"
                    size={20}
                    className="mt-0.5 shrink-0 text-ojid-green"
                  />
                  <span className="text-sm text-ink">{e}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/organisation" className={buttonVariants({ variant: "secondary" })}>
                Notre organisation
                <Icon name="ArrowRight" size={18} />
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Nous contacter
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
