import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { can, isDepartmentScoped, type Capability } from "@/lib/permissions";

/** Exige un utilisateur connecte (sinon redirige vers /login). Pour les pages. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Exige une capacite (sinon redirige vers le dashboard). Pour les pages. */
export async function requireCapability(
  capability: Capability,
): Promise<CurrentUser> {
  const user = await requireUser();
  if (!can(user.role, capability)) redirect("/dashboard?denied=1");
  return user;
}

/** Variante pour server actions : renvoie l'utilisateur ou null (pas de redirect). */
export async function getActor(): Promise<CurrentUser | null> {
  return getCurrentUser();
}

/**
 * Restreint une requete Prisma de dossiers au perimetre de l'utilisateur.
 * Les responsables de departement ne voient que les appels de leur departement.
 */
export function submissionScopeWhere(user: CurrentUser) {
  if (isDepartmentScoped(user.role) && user.departmentId) {
    return { opportunity: { departmentId: user.departmentId } };
  }
  return {};
}
