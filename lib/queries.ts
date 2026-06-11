import { prisma } from "@/lib/prisma";
import { parseObject } from "@/lib/json";
import type { Stat } from "@/components/public/stats-grid";

/** Statuts d'appels visibles publiquement (tout sauf brouillon). */
export const PUBLIC_OPP_STATUSES = [
  "SCHEDULED",
  "PUBLISHED",
  "CLOSED",
  "UNDER_REVIEW",
  "RESULTS_PUBLISHED",
  "SUSPENDED",
  "ARCHIVED",
];

export async function getLatestNews(take = 3) {
  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
    include: { department: { select: { name: true } } },
  });
}

export async function getRecentActivities(take = 3) {
  return prisma.activity.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: [{ featured: "desc" }, { startDate: "desc" }, { createdAt: "desc" }],
    take,
    include: { department: { select: { name: true } } },
  });
}

export async function getOpenOpportunities(take = 6) {
  return prisma.opportunity.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { deadline: "asc" }, { createdAt: "desc" }],
    take,
    include: { department: { select: { name: true } } },
  });
}

export async function getActivePartners(take = 12) {
  return prisma.partner.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    take,
  });
}

export async function countOpenOpportunities() {
  return prisma.opportunity.count({ where: { status: "PUBLISHED" } });
}

export async function getPublicStats(): Promise<Stat[]> {
  const [activities, opportunities, partners, departments, setting] =
    await Promise.all([
      prisma.activity.count(),
      prisma.opportunity.count({ where: { status: { in: PUBLIC_OPP_STATUSES } } }),
      prisma.partner.count({ where: { isActive: true } }),
      prisma.department.count({ where: { isActive: true } }),
      prisma.siteSetting.findUnique({ where: { key: "publicStats" } }),
    ]);

  const overrides = parseObject<{ members?: number; countries?: number }>(
    setting?.value,
    {},
  );

  return [
    {
      label: "Membres engages",
      value: overrides.members ?? 250,
      suffix: "+",
      icon: "Users",
    },
    { label: "Activites menees", value: Math.max(activities, 0), icon: "CalendarCheck" },
    { label: "Appels publies", value: Math.max(opportunities, 0), icon: "Megaphone" },
    {
      label: "Departements",
      value: Math.max(departments, 0),
      icon: "Building2",
    },
    { label: "Partenaires", value: Math.max(partners, 0), icon: "Handshake" },
  ].slice(0, 4);
}
