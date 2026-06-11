import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { parseArray } from "@/lib/json";
import { PageTitle } from "@/components/dashboard/page-title";
import { ActivityForm } from "@/components/dashboard/activity-form";
import { Icon } from "@/components/ui/icon";
import { updateActivity } from "../../actions";

export const dynamic = "force-dynamic";

function isoDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("activities.create");
  const { id } = await params;
  const [activity, departments] = await Promise.all([
    prisma.activity.findUnique({ where: { id } }),
    prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!activity) notFound();

  const initial = {
    id: activity.id,
    title: activity.title,
    excerpt: activity.excerpt ?? "",
    description: activity.description,
    location: activity.location ?? "",
    startDate: isoDate(activity.startDate),
    endDate: isoDate(activity.endDate),
    objectives: activity.objectives ?? "",
    results: activity.results ?? "",
    status: activity.status,
    coverImage: activity.coverImage ?? "",
    partners: parseArray<string>(activity.partners).join(", "),
    featured: activity.featured,
    departmentId: activity.departmentId ?? "",
  };

  return (
    <>
      <Link
        href="/dashboard/activites"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux activites
      </Link>
      <PageTitle title="Modifier l'activite" description={activity.title} />
      <ActivityForm
        action={updateActivity}
        departments={departments}
        initial={initial}
        submitLabel="Enregistrer"
      />
    </>
  );
}
