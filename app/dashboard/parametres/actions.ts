"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { toJson } from "@/lib/json";
import { str, boolFrom } from "@/lib/dash-forms";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string; success?: string };

export async function updateSiteSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "settings.manage")) return { error: "Non autorise." };

  const value = {
    heroPhrase: str(formData.get("heroPhrase")),
    tagline: str(formData.get("tagline")),
    contactEmail: str(formData.get("contactEmail")),
    contactPhone: str(formData.get("contactPhone")),
    address: str(formData.get("address")),
    enableSmartScoring: boolFrom(formData.get("enableSmartScoring")),
    smartScoringThreshold: Number(formData.get("smartScoringThreshold") || "30"),
  };

  await prisma.siteSetting.upsert({
    where: { key: "site" },
    create: { key: "site", value: toJson(value) },
    update: { value: toJson(value) },
  });
  await logAudit({ userId: user.id, action: "SETTINGS_UPDATED", entityType: "SiteSetting", entityId: "site" });
  revalidatePath("/dashboard/parametres");
  revalidatePath("/");
  return { success: "Parametres enregistres." };
}
