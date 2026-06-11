import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { parseArray } from "@/lib/json";
import { PageTitle } from "@/components/dashboard/page-title";
import { DepartmentForm } from "@/components/dashboard/department-form";
import { Icon } from "@/components/ui/icon";
import { updateDepartment } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("departments.manage");
  const { id } = await params;
  const [dept, heads] = await Promise.all([
    prisma.department.findUnique({ where: { id } }),
    prisma.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!dept) notFound();

  const initial = {
    id: dept.id,
    name: dept.name,
    icon: dept.icon ?? "",
    shortDescription: dept.shortDescription ?? "",
    description: dept.description ?? "",
    mission: dept.mission ?? "",
    responsibilities: parseArray<string>(dept.responsibilities).join("\n"),
    publicEmail: dept.publicEmail ?? "",
    headId: dept.headId ?? "",
    order: dept.order,
    isActive: dept.isActive,
  };

  return (
    <>
      <Link
        href="/dashboard/departements"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux departements
      </Link>
      <PageTitle title="Modifier le departement" description={dept.name} />
      <DepartmentForm
        action={updateDepartment}
        heads={heads}
        initial={initial}
        submitLabel="Enregistrer"
      />
    </>
  );
}
