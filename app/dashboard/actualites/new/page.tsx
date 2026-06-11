import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { NewsForm } from "@/components/dashboard/news-form";
import { Icon } from "@/components/ui/icon";
import { createNews } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  await requireCapability("news.create");
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link
        href="/dashboard/actualites"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux actualites
      </Link>
      <PageTitle title="Nouvel article" />
      <NewsForm action={createNews} departments={departments} submitLabel="Creer l'article" />
    </>
  );
}
