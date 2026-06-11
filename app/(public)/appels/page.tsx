import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PUBLIC_OPP_STATUSES } from "@/lib/queries";
import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { OpportunityFilters } from "@/components/public/opportunity-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Centre des appels & opportunites",
  description:
    "Appels a projets, candidatures, offres, concours, stages et programmes de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

const STATUS_RANK: Record<string, number> = {
  PUBLISHED: 0,
  SCHEDULED: 1,
  UNDER_REVIEW: 2,
  RESULTS_PUBLISHED: 3,
  SUSPENDED: 4,
  CLOSED: 5,
  ARCHIVED: 6,
};

export default async function AppelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    group?: string;
    statut?: string;
    departement?: string;
  }>;
}) {
  const sp = await searchParams;
  const [all, departments] = await Promise.all([
    prisma.opportunity.findMany({
      where: { status: { in: PUBLIC_OPP_STATUSES } },
      include: { department: { select: { name: true, slug: true } } },
    }),
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const q = (sp.q ?? "").trim().toLowerCase();
  const filtered = all
    .filter((o) => {
      if (sp.statut && o.status !== sp.statut) return false;
      if (sp.departement && o.department?.slug !== sp.departement) return false;
      if (sp.group) {
        const meta = OPPORTUNITY_TYPE_META[o.type as OpportunityType];
        if (!meta || meta.group !== sp.group) return false;
      }
      if (q) {
        const hay = `${o.title} ${o.summary ?? ""} ${o.domain ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 9;
      const rb = STATUS_RANK[b.status] ?? 9;
      if (ra !== rb) return ra - rb;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const da = a.deadline ? a.deadline.getTime() : Infinity;
      const db = b.deadline ? b.deadline.getTime() : Infinity;
      return da - db;
    });

  const hasFilters = Boolean(sp.q || sp.group || sp.statut || sp.departement);

  return (
    <>
      <PageHeader
        eyebrow="Centre des appels & opportunites"
        eyebrowIcon="Megaphone"
        title="Appels & opportunites de l'OIJD"
        description="Appels a projets, candidatures, offres, concours, stages, volontariats et programmes. Trouvez l'opportunite qui vous correspond et soumettez votre dossier en ligne."
        breadcrumb={[{ label: "Appels & opportunites" }]}
      />

      <Section>
        <Container>
          <OpportunityFilters
            departments={departments}
            current={sp}
          />

          <p className="mt-6 text-sm text-muted">
            <strong className="text-ink">{filtered.length}</strong>{" "}
            {pluralize(filtered.length, "appel trouve", "appels trouves")}
            {hasFilters ? " (filtre applique)" : ""}
          </p>

          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((o, i) => (
                <Reveal key={o.id} delay={(i % 3) * 0.05}>
                  <OpportunityCard opp={o} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-8"
              icon="Search"
              title="Aucun appel ne correspond"
              description="Modifiez vos filtres ou revenez bientot : de nouvelles opportunites sont publiees regulierement."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
