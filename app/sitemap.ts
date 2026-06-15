import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.APP_URL || siteConfig.url).replace(/\/$/, "");

  const staticPaths = [
    "",
    "/a-propos",
    "/organisation",
    "/departements",
    "/responsables",
    "/actualites",
    "/activites",
    "/appels",
    "/partenaires",
    "/contact",
    "/conception-realisation",
    "/mentions-legales",
    "/confidentialite",
  ];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [news, activities, opps, depts] = await Promise.all([
      prisma.news.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.activity.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.opportunity.findMany({
        where: { status: { in: ["PUBLISHED", "CLOSED", "UNDER_REVIEW", "RESULTS_PUBLISHED"] } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.department.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    dynamicRoutes = [
      ...news.map((n) => ({ url: `${base}/actualites/${n.slug}`, lastModified: n.updatedAt })),
      ...activities.map((a) => ({ url: `${base}/activites/${a.slug}`, lastModified: a.updatedAt })),
      ...opps.map((o) => ({ url: `${base}/appels/${o.slug}`, lastModified: o.updatedAt })),
      ...depts.map((d) => ({ url: `${base}/departements/${d.slug}`, lastModified: d.updatedAt })),
    ];
  } catch {
    /* base indisponible au build : on renvoie au moins les routes statiques */
  }

  return [...staticRoutes, ...dynamicRoutes];
}
