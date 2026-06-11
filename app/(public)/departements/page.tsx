import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { DepartmentCard } from "@/components/public/department-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Departements",
  description:
    "Les departements de l'OIJD - Section CIV : missions, responsables et activites.",
};

export const dynamic = "force-dynamic";

export default async function DepartementsPage() {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Notre structure"
        eyebrowIcon="Building2"
        title="Nos departements"
        description="Une organisation structuree autour de departements thematiques, chacun porteur de missions et d'activites concretes."
        breadcrumb={[{ label: "Departements" }]}
      />
      <Section>
        <Container>
          {departments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((d, i) => (
                <Reveal key={d.id} delay={i * 0.04}>
                  <DepartmentCard dept={d} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="Building2"
              title="Aucun departement"
              description="Les departements seront bientot publies."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
