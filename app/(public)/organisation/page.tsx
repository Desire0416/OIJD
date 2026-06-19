import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { bureauExecutif } from "@/lib/site-config";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { BureauCard } from "@/components/public/bureau-card";
import { DepartmentCard } from "@/components/public/department-card";

export const metadata: Metadata = {
  title: "Notre organisation",
  description:
    "Organigramme, bureau executif, departements et responsables de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

export default async function OrganisationPage() {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  const { president, vicePresidents, directeurs } = bureauExecutif;

  return (
    <>
      <PageHeader
        eyebrow="Notre structure"
        eyebrowIcon="Building2"
        title="Notre organisation"
        description="Une gouvernance claire : Presidence, Bureau Executif, departements et responsables identifies."
        breadcrumb={[{ label: "Organisation" }]}
      />

      {/* ================================================================
          ORGANIGRAMME
      ================================================================= */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Gouvernance"
              eyebrowIcon="Network"
              title="Organigramme general"
              description="Structure hierarchique du Bureau Executif de l'OIJD - Section CIV."
            />
          </Reveal>

          {/* --- Presidence --- */}
          <Reveal delay={0.05}>
            <div className="mt-12 flex flex-col items-center">
              <div className="w-full max-w-xs">
                <BureauCard
                  member={{
                    name: president.name || "Presidence",
                    title: "President",
                    mission: president.mission,
                    photo: president.photo,
                    gender: "M",
                  }}
                  tone="president"
                />
              </div>
              {/* Connecteur */}
              <div className="my-4 h-8 w-0.5 bg-gradient-to-b from-ojid-green/60 to-ojid-orange/40" />
              <div className="rounded-full bg-ojid-green px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Bureau Executif
              </div>
              <div className="my-4 h-8 w-0.5 bg-gradient-to-b from-ojid-orange/40 to-ojid-orange/60" />
            </div>
          </Reveal>

          {/* --- Vice-Presidents --- */}
          <Reveal delay={0.1}>
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-ojid-orange/30 bg-ojid-orange/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-ojid-orange">
                <Icon name="Star" size={12} />
                Vice-Presidents
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {vicePresidents.map((vp, i) => (
                <Reveal key={vp.name} delay={i * 0.06}>
                  <BureauCard member={vp} tone="vp" />
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Connecteur */}
          <div className="my-8 flex flex-col items-center">
            <div className="h-8 w-0.5 bg-gradient-to-b from-ojid-orange/40 to-ojid-bluegray/40" />
          </div>

          {/* --- Directeurs --- */}
          <Reveal delay={0.15}>
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-ojid-bluegray/30 bg-ojid-bluegray/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-ojid-bluegray">
                <Icon name="Users" size={12} />
                Directeurs
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {directeurs.map((d, i) => (
                <Reveal key={d.name} delay={i * 0.05}>
                  <BureauCard member={d} tone="dir" />
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Connecteur */}
          <div className="my-8 flex flex-col items-center">
            <div className="h-8 w-0.5 bg-gradient-to-b from-ojid-bluegray/40 to-ojid-green/30" />
          </div>

          {/* --- Departements (schema simplifie) --- */}
          <Reveal delay={0.2}>
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-ojid-green/30 bg-ojid-green/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-ojid-green">
                <Icon name="Building2" size={12} />
                {departments.length} Departements
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {departments.map((d) => (
                <Link
                  key={d.id}
                  href={`/departements/${d.slug}`}
                  className="group flex items-center gap-2 rounded-xl border border-ojid-gray bg-white p-2.5 text-sm font-medium text-ink transition-colors hover:border-ojid-green/30 hover:bg-ojid-green/5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ojid-green/10 text-ojid-green group-hover:bg-ojid-green group-hover:text-white transition-colors">
                    <Icon name={d.icon || "Building2"} size={14} />
                  </span>
                  <span className="line-clamp-2 leading-tight text-xs">{d.name}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ================================================================
          DEPARTEMENTS (version complete)
      ================================================================= */}
      <Section muted>
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Departements & commissions"
                eyebrowIcon="Layers"
                title="Nos departements"
                description="Chaque departement dispose d'une page dediee, d'un responsable et de ses activites."
              />
              <Link href="/departements" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Explorer
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.04}>
                <DepartmentCard dept={d} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
