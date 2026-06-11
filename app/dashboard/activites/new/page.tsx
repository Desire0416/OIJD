import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { ActivityForm } from "@/components/dashboard/activity-form";
import { Icon } from "@/components/ui/icon";
import { createActivity } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewActivityPage() {
  await requireCapability("activities.create");
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link
        href="/dashboard/activites"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux activites
      </Link>
      <PageTitle title="Nouvelle activite" />
      <ActivityForm action={createActivity} departments={departments} submitLabel="Creer l'activite" />
    </>
  );
}
