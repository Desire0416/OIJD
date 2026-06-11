import { prisma } from "@/lib/prisma";
import { parseObject } from "@/lib/json";
import { siteConfig } from "@/lib/site-config";

export type SiteSettings = {
  heroPhrase: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  enableSmartScoring: boolean;
  smartScoringThreshold: number;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    heroPhrase: siteConfig.heroPhrase,
    tagline: siteConfig.tagline,
    contactEmail: siteConfig.contact.email,
    contactPhone: siteConfig.contact.phone,
    address: siteConfig.contact.address,
    enableSmartScoring: process.env.ENABLE_SMART_SCORING !== "false",
    smartScoringThreshold: Number(process.env.SMART_SCORING_THRESHOLD || "30"),
  };
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "site" } });
    if (!row) return defaults;
    return { ...defaults, ...parseObject<Partial<SiteSettings>>(row.value, {}) };
  } catch {
    return defaults;
  }
}
