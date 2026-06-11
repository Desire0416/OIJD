import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ActivityCard } from "@/components/public/activity-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ACTIVITY_STATUS, ACTIVITY_STATUS_META, type ActivityStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Activites",
  description: "Les activites, evenements et projets de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

export default async function ActivitesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;
  const valid = ACTIVITY_STATUS.includes(statut as ActivityStatus)
    ? (statut as ActivityStatus)
    : undefined;

  const activities = await prisma.activity.findMany({
    where: {
      status: valid ? valid : { not: "ARCHIVED" },
    },
    orderBy: [{ featured: "desc" }, { startDate: "desc" }, { createdAt: "desc" }],
    include: { department: { select: { name: true } } },
  });

  const filters: ActivityStatus[] = ["ONGOING", "PLANNED", "COMPLETED"];

  return (
    <>
      <PageHeader
        eyebrow="Sur le terrain"
        eyebrowIcon="CalendarCheck"
        title="Nos activites & projets"
        description="Decouvrez les actions menees par nos departements : evenements, formations, projets et initiatives."
        breadcrumb={[{ label: "Activites" }]}
      />
      <Section>
        <Container>
          <div className="mb-10 flex flex-wrap gap-2">
            <Chip href="/activites" active={!valid} label="Toutes" />
            {filters.map((s) => (
              <Chip
                key={s}
                href={`/activites?statut=${s}`}
                active={valid === s}
                label={ACTIVITY_STATUS_META[s].label}
              />
            ))}
          </div>
          {activities.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 0.06}>
                  <ActivityCard activity={a} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="CalendarCheck"
              title="Aucune activite"
              description="Aucune activite ne correspond a ce filtre pour le moment."
            />
          )}
        </Container>
      </Section>
    </>
  );
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ojid-green bg-ojid-green text-white"
          : "border-ojid-gray bg-white text-ink hover:border-ojid-green/40 hover:text-ojid-green",
      )}
    >
      {label}
    </Link>
  );
}
