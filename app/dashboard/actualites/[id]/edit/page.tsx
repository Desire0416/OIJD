import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { parseArray } from "@/lib/json";
import { PageTitle } from "@/components/dashboard/page-title";
import { NewsForm } from "@/components/dashboard/news-form";
import { Icon } from "@/components/ui/icon";
import { updateNews } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("news.create");
  const { id } = await params;
  const [news, departments] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!news) notFound();

  const initial = {
    id: news.id,
    title: news.title,
    excerpt: news.excerpt ?? "",
    content: news.content,
    category: news.category ?? "",
    keywords: parseArray<string>(news.keywords).join(", "),
    coverImage: news.coverImage ?? "",
    status: news.status,
    featured: news.featured,
    departmentId: news.departmentId ?? "",
  };

  return (
    <>
      <Link
        href="/dashboard/actualites"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux actualites
      </Link>
      <PageTitle title="Modifier l'article" description={news.title} />
      <NewsForm
        action={updateNews}
        departments={departments}
        initial={initial}
        submitLabel="Enregistrer"
      />
    </>
  );
}
