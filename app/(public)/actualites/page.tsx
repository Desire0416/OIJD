import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { NewsCard } from "@/components/public/news-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Actualites",
  description:
    "Communiques, evenements et comptes rendus de l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const all = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { department: { select: { name: true } } },
  });

  const categories = Array.from(
    new Set(all.map((n) => n.category).filter(Boolean) as string[]),
  );
  const news = categorie
    ? all.filter((n) => n.category === categorie)
    : all;

  return (
    <>
      <PageHeader
        eyebrow="Actualites"
        eyebrowIcon="Newspaper"
        title="Nos actualites"
        description="Suivez les communiques, evenements et comptes rendus de l'organisation."
        breadcrumb={[{ label: "Actualites" }]}
      />
      <Section>
        <Container>
          {categories.length > 0 ? (
            <div className="mb-10 flex flex-wrap gap-2">
              <FilterChip href="/actualites" active={!categorie} label="Toutes" />
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  href={`/actualites?categorie=${encodeURIComponent(c)}`}
                  active={categorie === c}
                  label={c}
                />
              ))}
            </div>
          ) : null}

          {news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n, i) => (
                <Reveal key={n.id} delay={(i % 3) * 0.06}>
                  <NewsCard news={n} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="Newspaper"
              title="Aucune actualite"
              description="Aucune actualite ne correspond a ce filtre pour le moment."
            />
          )}
        </Container>
      </Section>
    </>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
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
