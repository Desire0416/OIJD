import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCapability } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { UserForm } from "@/components/dashboard/user-form";
import { Icon } from "@/components/ui/icon";
import { createUser } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  await requireCapability("users.manage");
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link
        href="/dashboard/utilisateurs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ojid-green"
      >
        <Icon name="ArrowLeft" size={16} /> Retour aux utilisateurs
      </Link>
      <PageTitle title="Nouvel utilisateur" />
      <UserForm action={createUser} departments={departments} />
    </>
  );
}
