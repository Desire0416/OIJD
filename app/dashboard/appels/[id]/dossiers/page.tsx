import { redirect } from "next/navigation";

/** Les dossiers d'un appel sont geres dans la liste filtree des dossiers. */
export default async function AppelDossiersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/dossiers?appel=${id}`);
}
