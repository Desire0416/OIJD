import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type SluggedModel = "opportunity" | "news" | "activity" | "department" | "partner";

/** Genere un slug unique pour un modele donne (ajoute un suffixe si collision). */
export async function uniqueSlug(
  model: SluggedModel,
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(title) || "element";
  let slug = base;
  let i = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[model];
  while (true) {
    const existing = await delegate.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}
