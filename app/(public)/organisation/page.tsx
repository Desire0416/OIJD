import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { DepartmentCard } from "@/components/public/department-card";
import { PersonCard } from "@/components/public/person-card";

export const metadata: Metadata = {
  title: "Notre organisation",
  description:
    "Organigramme, instances dirigeantes, departements et responsables de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

const PUBLIC_ROLES = [
  "PRESIDENT",
  "ADMIN_GENERAL",
  "DEPARTMENT_HEAD",
  "COMMUNICATION_MANAGER",
  "HR_MANAGER",
  "CALLS_MANAGER",
];

export default async function OrganisationPage() {
  const [departments, leadership] = await Promise.all([
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.user.findMany({
      where: { status: "ACTIVE", role: { in: PUBLIC_ROLES } },
      orderBy: { createdAt: "asc" },
      include: { department: { select: { name: true } } },
    }),
  ]);

  const direction = leadership.filter((u) =>
    ["PRESIDENT", "ADMIN_GENERAL"].includes(u.role),
  );

  return (
    <>
      <PageHeader
        eyebrow="Notre structure"
        eyebrowIcon="Building2"
        title="Notre organisation"
        description="Une gouvernance claire, structuree autour d'instances dirigeantes, de departements et de responsables identifies."
        breadcrumb={[{ label: "Organisation" }]}
      />

      {/* Organigramme */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Gouvernance"
              eyebrowIcon="Network"
              title="Organigramme general"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-ojid-green to-ojid-green-dark px-8 py-4 text-center text-white shadow-soft">
                <Icon name="Flag" size={22} className="mx-auto text-ojid-orange-flame" />
                <p className="mt-1 font-heading font-bold">Presidence / Direction</p>
              </div>
              <div className="h-8 w-px bg-ojid-bluegray/40" />
              <div className="rounded-2xl border border-ojid-gray bg-white px-8 py-4 text-center shadow-sm">
                <Icon name="Building2" size={20} className="mx-auto text-ojid-green" />
                <p className="mt-1 font-heading font-bold text-ink">
                  Administration generale & coordination
                </p>
              </div>
              <div className="h-8 w-px bg-ojid-bluegray/40" />
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {departments.slice(0, 8).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 rounded-xl border border-ojid-gray bg-ojid-gray/30 px-3 py-2.5 text-sm font-medium text-ink"
                  >
                    <Icon name={d.icon ?? "Building2"} size={16} className="text-ojid-green" />
                    <span className="truncate">{d.name}</span>
                  </div>
                ))}
                <div className="flex items-center justify-center rounded-xl border border-dashed border-ojid-gray px-3 py-2.5 text-sm font-semibold text-ojid-green">
                  +{Math.max(departments.length - 8, 0)} departements
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Instances dirigeantes */}
      {direction.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Instances dirigeantes"
                eyebrowIcon="Star"
                title="La direction"
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {direction.map((u, i) => (
                <Reveal key={u.id} delay={i * 0.06}>
                  <PersonCard person={u} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Departements */}
      <Section>
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
                Tout voir
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.04}>
                <DepartmentCard dept={d} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Responsables */}
      {leadership.length > 0 ? (
        <Section muted>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="L'equipe"
                  eyebrowIcon="Users"
                  title="Responsables principaux"
                />
                <Link href="/responsables" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Tous les responsables
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {leadership.slice(0, 8).map((u, i) => (
                <Reveal key={u.id} delay={i * 0.05}>
                  <PersonCard person={u} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
