import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { UserForm } from "@/components/dashboard/user-form";
import { Icon } from "@/components/ui/icon";
import { updateUser } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCapability("users.manage");
  const { id } = await params;
  const [user, departments] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.department.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!user) notFound();

  const initial = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    departmentId: user.departmentId ?? "",
    title: user.title ?? "",
    phone: user.phone ?? "",
    bio: user.bio ?? "",
  };

  return (
    <>
      <Link
        href="/dashboard/utilisateurs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux utilisateurs
      </Link>
      <PageTitle title="Modifier l'utilisateur" description={user.email} />
      <UserForm action={updateUser} departments={departments} initial={initial} isEdit />
    </>
  );
}
