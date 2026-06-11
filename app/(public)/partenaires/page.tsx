import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PartnerCard } from "@/components/public/partner-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Institutions, ONG et organisations partenaires de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

export default async function PartenairesPage() {
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Ils nous accompagnent"
        eyebrowIcon="Handshake"
        title="Nos partenaires"
        description="L'OIJD - Section CIV agit aux cotes d'institutions, d'ONG et d'organisations engagees pour la jeunesse et la cooperation."
        breadcrumb={[{ label: "Partenaires" }]}
      />
      <Section>
        <Container>
          {partners.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.05}>
                  <PartnerCard partner={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="Handshake"
              title="Aucun partenaire publie"
              description="Nos partenariats seront bientot mis en avant ici."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
