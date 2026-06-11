"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { PUBLISH_STATUS, PUBLISH_STATUS_META } from "@/lib/constants";

type FormState = { error?: string };
type Initial = Record<string, string | boolean | undefined>;

export function NewsForm({
  action,
  departments,
  initial = {},
  submitLabel = "Enregistrer",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  departments: { id: string; name: string }[];
  initial?: Initial;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = (k: string) => (initial[k] as string) ?? "";

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}

      <div className="space-y-6">
        {state.error ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
            {state.error}
          </div>
        ) : null}
        <Card className="p-5">
          <Field label="Titre" required>
            <Input name="title" defaultValue={v("title")} required />
          </Field>
          <Field label="Resume / chapeau" className="mt-4" hint="Affiche dans les cartes et l'apercu.">
            <Textarea name="excerpt" rows={2} defaultValue={v("excerpt")} />
          </Field>
          <Field label="Contenu" required className="mt-4" hint="Les sauts de ligne sont conserves.">
            <Textarea name="content" rows={14} defaultValue={v("content")} required />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="mb-4 font-heading font-bold text-ink">Publication</h3>
          <Field label="Statut">
            <Select name="status" defaultValue={v("status") || "DRAFT"}>
              {PUBLISH_STATUS.map((s) => (
                <option key={s} value={s}>
                  {PUBLISH_STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Departement" className="mt-4">
            <Select name="departmentId" defaultValue={v("departmentId")}>
              <option value="">Aucun</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Categorie" className="mt-4">
            <Input name="category" defaultValue={v("category")} placeholder="Communique, Evenement..." />
          </Field>
          <div className="mt-4">
            <Checkbox name="featured" defaultChecked={Boolean(initial.featured)} label="Mettre en avant (accueil)" />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-heading font-bold text-ink">Medias & SEO</h3>
          <Field label="Image de couverture (URL)" hint="Laisser vide pour un visuel genere.">
            <Input name="coverImage" defaultValue={v("coverImage")} placeholder="https://..." />
          </Field>
          <Field label="Mots-cles" className="mt-4" hint="Separes par des virgules.">
            <Input name="keywords" defaultValue={v("keywords")} />
          </Field>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} icon="Check">
            {submitLabel}
          </Button>
          <Link href="/dashboard/actualites" className={buttonVariants({ variant: "ghost" })}>
            Annuler
          </Link>
        </div>
      </div>
    </form>
  );
}
