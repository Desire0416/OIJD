import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Conception & realisation",
  description:
    "Cette plateforme a ete concue et realisee par Digital Access - Web Access Solution.",
};

const competences = [
  { icon: "Building2", title: "Sites institutionnels", desc: "Des sites modernes, credibles et professionnels." },
  { icon: "LayoutDashboard", title: "Plateformes de gestion", desc: "Tableaux de bord, roles, workflows et suivi." },
  { icon: "Megaphone", title: "Portails d'appels a projets", desc: "Publication, filtres et gestion des opportunites." },
  { icon: "FileUp", title: "Candidatures en ligne", desc: "Formulaires dynamiques et depot de pieces." },
  { icon: "BarChart3", title: "Tri & presynthese", desc: "Scoring et aide a la decision, sans automatisme aveugle." },
  { icon: "ShieldCheck", title: "Securite & accompagnement", desc: "Donnees protegees, formation et maintenance." },
];

const roleInProject = [
  { icon: "Search", title: "Conseil & cadrage", desc: "Comprendre les besoins, structurer les modules et clarifier les roles." },
  { icon: "Sparkles", title: "Design institutionnel", desc: "Une interface moderne inspiree du logo officiel de l'OIJD." },
  { icon: "Layers", title: "Developpement web", desc: "Site public, espaces prives, departements et candidatures." },
  { icon: "Megaphone", title: "Gestion des appels", desc: "Appels a projets, candidatures, offres et opportunites." },
  { icon: "MailCheck", title: "Automatisation", desc: "Emails automatiques, tri rapide et presynthese des dossiers." },
  { icon: "GraduationCap", title: "Deploiement & formation", desc: "Mise en ligne, formation des equipes et accompagnement." },
];

export default function ConceptionRealisationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partenaire technique"
        eyebrowIcon="Sparkles"
        title="Conception & realisation de la plateforme"
        description={`Cette plateforme institutionnelle a ete concue et realisee par ${siteConfig.digitalAccess.name}.`}
        breadcrumb={[{ label: "Conception & realisation" }]}
      />

      <Section>
        <Container>
          <Reveal>
            <Card className="relative overflow-hidden border-digital-purple/20 bg-gradient-to-br from-digital-purple/[0.06] to-white p-8 md:p-12">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-digital-purple/10 text-digital-purple">
                  <Icon name="Sparkles" size={30} />
                </span>
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-digital-purple">
                    {siteConfig.digitalAccess.name}
                  </h2>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                    {siteConfig.digitalAccess.tagline} Digital Access transforme
                    les besoins des organisations en solutions web
                    professionnelles, credibles, securisees et exploitables sur le
                    terrain.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section muted className="!pt-0 pt-0">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold">
              Domaines de competence
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Digital Access accompagne institutions, associations, ecoles, ONG
              et structures publiques ou privees.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {competences.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <Card interactive className="h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-digital-purple/10 text-digital-purple">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{c.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold">
              Notre role dans le projet OIJD
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Du cadrage a l'accompagnement, Digital Access pilote l'ensemble de
              la chaine de realisation.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roleInProject.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="flex h-full gap-4 rounded-2xl border border-ojid-gray bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-digital-purple/10 text-digital-purple">
                    <Icon name={r.icon} size={19} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{r.title}</h3>
                    <p className="mt-1 text-sm text-muted">{r.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-digital-purple to-[#4a1b86] px-6 py-12 text-center text-white md:px-12">
              <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
                Un projet numerique a concretiser ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Digital Access - Web Access Solution accompagne votre
                organisation, de l'idee a la mise en ligne.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "!bg-white !text-digital-purple hover:!bg-white/90",
                  })}
                >
                  Nous contacter
                  <Icon name="ArrowRight" size={18} />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
