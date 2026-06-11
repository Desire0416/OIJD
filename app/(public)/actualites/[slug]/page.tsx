import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/ui/rich-text";
import { CoverPlaceholder } from "@/components/ui/cover-placeholder";
import { NewsCard } from "@/components/public/news-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getNews(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
    include: {
      department: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return { title: "Actualite introuvable" };
  return {
    title: news.title,
    description: news.excerpt ?? undefined,
    openGraph: { title: news.title, description: news.excerpt ?? undefined },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news || news.status !== "PUBLISHED") notFound();

  const related = await prisma.news.findMany({
    where: { status: "PUBLISHED", slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { department: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader
        eyebrow={news.category ?? "Actualite"}
        eyebrowIcon="Newspaper"
        title={news.title}
        breadcrumb={[
          { label: "Actualites", href: "/actualites" },
          { label: news.title.slice(0, 40) + (news.title.length > 40 ? "..." : "") },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="CalendarDays" size={15} />
            {formatDate(news.publishedAt ?? news.createdAt)}
          </span>
          {news.department ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Building2" size={15} />
              {news.department.name}
            </span>
          ) : null}
          {news.author ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Users" size={15} />
              {news.author.name}
            </span>
          ) : null}
        </div>
      </PageHeader>

      <Section>
        <Container className="max-w-3xl">
          <Reveal>
            <div className="overflow-hidden rounded-2xl shadow-card">
              {news.coverImage ? (
                <img
                  src={news.coverImage}
                  alt={news.title}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <CoverPlaceholder seed={news.slug} icon="Newspaper" className="h-64 w-full" />
              )}
            </div>
          </Reveal>
          {news.excerpt ? (
            <p className="mt-8 text-xl font-medium leading-relaxed text-ink">
              {news.excerpt}
            </p>
          ) : null}
          <article className="mt-6">
            <RichText content={news.content} />
          </article>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section muted>
          <Container>
            <SectionHeading
              eyebrow="A lire aussi"
              eyebrowIcon="Newspaper"
              title="Actualites similaires"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.06}>
                  <NewsCard news={n} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ojid-green"
              >
                <Icon name="ArrowLeft" size={16} />
                Toutes les actualites
              </Link>
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
