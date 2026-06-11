import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { DepartmentForm } from "@/components/dashboard/department-form";
import { Icon } from "@/components/ui/icon";
import { createDepartment } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewDepartmentPage() {
  await requireCapability("departments.manage");
  const heads = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link
        href="/dashboard/departements"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux departements
      </Link>
      <PageTitle title="Nouveau departement" />
      <DepartmentForm action={createDepartment} heads={heads} submitLabel="Creer le departement" />
    </>
  );
}
