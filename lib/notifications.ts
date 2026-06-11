import { prisma } from "@/lib/prisma";

type NotificationPayload = {
  type: string;
  title: string;
  message: string;
  link?: string;
};

/** Cree une notification interne pour un utilisateur. */
export async function notifyUser(userId: string, payload: NotificationPayload) {
  try {
    await prisma.notification.create({ data: { userId, ...payload } });
  } catch (err) {
    console.error("[notifications] echec:", err);
  }
}

/**
 * Notifie l'ensemble des utilisateurs actifs ayant l'un des roles donnes,
 * eventuellement restreint a un departement (en plus des roles transverses).
 */
export async function notifyRoles(
  roles: string[],
  payload: NotificationPayload,
  options?: { departmentId?: string | null },
) {
  try {
    const users = await prisma.user.findMany({
      where: { status: "ACTIVE", role: { in: roles } },
      select: { id: true, role: true, departmentId: true },
    });
    const deptHeadRoles = new Set(["DEPARTMENT_HEAD"]);
    const targets = users.filter((u) => {
      // Les responsables de departement ne sont notifies que pour leur dept.
      if (deptHeadRoles.has(u.role) && options?.departmentId) {
        return u.departmentId === options.departmentId;
      }
      return true;
    });
    if (targets.length === 0) return;
    await prisma.notification.createMany({
      data: targets.map((u) => ({ userId: u.id, ...payload })),
    });
  } catch (err) {
    console.error("[notifications] echec (roles):", err);
  }
}

/** Notification a la reception d'un nouveau dossier. */
export async function notifyNewSubmission(args: {
  opportunityTitle: string;
  submissionId: string;
  reference: string;
  departmentId?: string | null;
}) {
  await notifyRoles(
    [
      "SUPER_ADMIN",
      "ADMIN_GENERAL",
      "CALLS_MANAGER",
      "HR_MANAGER",
      "DEPARTMENT_HEAD",
    ],
    {
      type: "SUBMISSION_RECEIVED",
      title: "Nouveau dossier recu",
      message: `Dossier ${args.reference} pour « ${args.opportunityTitle} ».`,
      link: `/dashboard/dossiers/${args.submissionId}`,
    },
    { departmentId: args.departmentId },
  );
}
