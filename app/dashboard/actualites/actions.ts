"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/dash-auth";
import { can } from "@/lib/permissions";
import { newsSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugs";
import { csvToArray, boolFrom, optStr } from "@/lib/dash-forms";
import { toJson } from "@/lib/json";
import { logAudit } from "@/lib/audit";

export type FormState = { error?: string };

function parse(formData: FormData) {
  return newsSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    category: formData.get("category") || undefined,
    keywords: formData.get("keywords") || undefined,
    coverImage: formData.get("coverImage") || undefined,
    status: formData.get("status") || "DRAFT",
    featured: formData.get("featured") || undefined,
    departmentId: formData.get("departmentId") || undefined,
  });
}

/** Un redacteur sans droit de publication ne peut pas publier directement. */
function clampStatus(role: string, status: string): string {
  if (status === "PUBLISHED" && !can(role, "news.publish") && !can(role, "content.validate"))
    return "PENDING_REVIEW";
  return status;
}

export async function createNews(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "news.create")) return { error: "Non autorise." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const d = parsed.data;
  const status = clampStatus(user.role, d.status);
  const slug = await uniqueSlug("news", d.title);

  const news = await prisma.news.create({
    data: {
      title: d.title,
      slug,
      excerpt: optStr(d.excerpt),
      content: d.content,
      category: optStr(d.category),
      keywords: toJson(csvToArray(formData.get("keywords"))),
      coverImage: optStr(d.coverImage),
      status,
      featured: boolFrom(formData.get("featured")),
      departmentId: optStr(d.departmentId),
      authorId: user.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  await logAudit({ userId: user.id, action: "NEWS_CREATED", entityType: "News", entityId: news.id });
  revalidatePath("/dashboard/actualites");
  revalidatePath("/actualites");
  redirect("/dashboard/actualites");
}

export async function updateNews(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getActor();
  if (!user || !can(user.role, "news.create")) return { error: "Non autorise." };
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  const d = parsed.data;
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return { error: "Actualite introuvable." };
  const status = clampStatus(user.role, d.status);
  const slug = await uniqueSlug("news", d.title, id);

  await prisma.news.update({
    where: { id },
    data: {
      title: d.title,
      slug,
      excerpt: optStr(d.excerpt),
      content: d.content,
      category: optStr(d.category),
      keywords: toJson(csvToArray(formData.get("keywords"))),
      coverImage: optStr(d.coverImage),
      status,
      featured: boolFrom(formData.get("featured")),
      departmentId: optStr(d.departmentId),
      publishedAt:
        status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
    },
  });
  await logAudit({ userId: user.id, action: "NEWS_UPDATED", entityType: "News", entityId: id });
  revalidatePath("/dashboard/actualites");
  revalidatePath("/actualites");
  redirect("/dashboard/actualites");
}

export async function deleteNews(formData: FormData): Promise<void> {
  const user = await getActor();
  if (!user || !can(user.role, "news.create")) return;
  const id = String(formData.get("id") || "");
  await prisma.document.deleteMany({ where: { newsId: id } });
  await prisma.news.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "NEWS_DELETED", entityType: "News", entityId: id });
  revalidatePath("/dashboard/actualites");
  revalidatePath("/actualites");
  redirect("/dashboard/actualites");
}
