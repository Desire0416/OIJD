import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dash-auth";
import { can, canAny } from "@/lib/permissions";
import { DashboardShell, type NavGroup } from "@/components/dashboard/dashboard-shell";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unread = await prisma.notification.count({
    where: { userId: user.id, readAt: null },
  });
  const role = user.role;

  const groups: NavGroup[] = [];

  const pilotage = [
    { label: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
  ];
  if (can(role, "stats.view"))
    pilotage.push({ label: "Statistiques", href: "/dashboard/statistiques", icon: "BarChart3" });
  groups.push({ title: "Pilotage", items: pilotage });

  const appels = [];
  if (canAny(role, ["opportunities.manage", "submissions.view"]))
    appels.push({ label: "Appels", href: "/dashboard/appels", icon: "Megaphone" });
  if (can(role, "submissions.view"))
    appels.push({ label: "Dossiers", href: "/dashboard/dossiers", icon: "Inbox" });
  if (canAny(role, ["documents.manage", "submissions.view"]))
    appels.push({ label: "Documents", href: "/dashboard/documents", icon: "FolderOpen" });
  if (appels.length) groups.push({ title: "Appels & dossiers", items: appels });

  const contenus = [];
  if (canAny(role, ["news.create", "content.validate"]))
    contenus.push({ label: "Actualites", href: "/dashboard/actualites", icon: "Newspaper" });
  if (canAny(role, ["activities.create", "content.validate"]))
    contenus.push({ label: "Activites", href: "/dashboard/activites", icon: "CalendarCheck" });
  if (can(role, "departments.manage"))
    contenus.push({ label: "Departements", href: "/dashboard/departements", icon: "Building2" });
  if (can(role, "partners.manage"))
    contenus.push({ label: "Partenaires", href: "/dashboard/partenaires", icon: "Handshake" });
  if (contenus.length) groups.push({ title: "Contenus", items: contenus });

  const comm = [
    { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  ];
  if (can(role, "emails.manage"))
    comm.unshift({ label: "Emails", href: "/dashboard/emails", icon: "MailCheck" });
  groups.push({ title: "Communication", items: comm });

  const admin = [];
  if (can(role, "users.manage"))
    admin.push({ label: "Utilisateurs", href: "/dashboard/utilisateurs", icon: "UserCog" });
  if (can(role, "audit.view"))
    admin.push({ label: "Journal d'audit", href: "/dashboard/audit", icon: "ScrollText" });
  if (can(role, "settings.manage"))
    admin.push({ label: "Parametres", href: "/dashboard/parametres", icon: "Settings" });
  if (admin.length) groups.push({ title: "Administration", items: admin });

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role }}
      groups={groups}
      unreadCount={unread}
      logout={logoutAction}
    >
      {children}
    </DashboardShell>
  );
}
