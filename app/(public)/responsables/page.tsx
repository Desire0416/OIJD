import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PersonCard } from "@/components/public/person-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Responsables",
  description: "Les responsables et l'equipe de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

const PUBLIC_ROLES = [
  "PRESIDENT",
  "ADMIN_GENERAL",
  "DEPARTMENT_HEAD",
  "COMMUNICATION_MANAGER",
  "HR_MANAGER",
  "CALLS_MANAGER",
  "VALIDATOR",
];

export default async function ResponsablesPage() {
  const people = await prisma.user.findMany({
    where: { status: "ACTIVE", role: { in: PUBLIC_ROLES } },
    orderBy: { createdAt: "asc" },
    include: { department: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader
        eyebrow="L'equipe"
        eyebrowIcon="Users"
        title="Nos responsables"
        description="Les femmes et les hommes qui animent les departements et les programmes de l'OIJD - Section CIV."
        breadcrumb={[
          { label: "Organisation", href: "/organisation" },
          { label: "Responsables" },
        ]}
      />
      <Section>
        <Container>
          {people.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {people.map((u, i) => (
                <Reveal key={u.id} delay={i * 0.04}>
                  <PersonCard person={u} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="Users"
              title="Aucun responsable publie"
              description="Les profils des responsables seront bientot disponibles."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
