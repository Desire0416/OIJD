"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

type FormState = { error?: string };
type Initial = Record<string, string | boolean | number | undefined>;

export function DepartmentForm({
  action,
  heads,
  initial = {},
  submitLabel = "Enregistrer",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  heads: { id: string; name: string }[];
  initial?: Initial;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = (k: string) => (initial[k] !== undefined ? String(initial[k]) : "");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}

      <div className="space-y-6">
        {state.error ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
            {state.error}
          </div>
        ) : null}
        <Card className="p-5">
          <Field label="Nom du departement" required>
            <Input name="name" defaultValue={v("name")} required />
          </Field>
          <Field label="Description courte" className="mt-4">
            <Textarea name="shortDescription" rows={2} defaultValue={v("shortDescription")} />
          </Field>
          <Field label="Mission" className="mt-4">
            <Textarea name="mission" rows={3} defaultValue={v("mission")} />
          </Field>
          <Field label="Presentation detaillee" className="mt-4">
            <Textarea name="description" rows={5} defaultValue={v("description")} />
          </Field>
          <Field label="Attributions" className="mt-4" hint="Une par ligne.">
            <Textarea name="responsibilities" rows={5} defaultValue={v("responsibilities")} />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="mb-4 font-heading font-bold text-ink">Parametres</h3>
          <Field label="Responsable">
            <Select name="headId" defaultValue={v("headId")}>
              <option value="">Aucun</option>
              {heads.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Email public" className="mt-4">
            <Input name="publicEmail" type="email" defaultValue={v("publicEmail")} />
          </Field>
          <Field label="Icone (lucide)" className="mt-4" hint="Ex: Megaphone, Scale, Users...">
            <Input name="icon" defaultValue={v("icon") || "Building2"} />
          </Field>
          <Field label="Ordre d'affichage" className="mt-4">
            <Input name="order" type="number" min={0} defaultValue={v("order") || "0"} />
          </Field>
          <div className="mt-4">
            <Checkbox
              name="isActive"
              defaultChecked={initial.isActive !== false}
              label="Departement actif (visible publiquement)"
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} icon="Check">
            {submitLabel}
          </Button>
          <Link href="/dashboard/departements" className={buttonVariants({ variant: "ghost" })}>
            Annuler
          </Link>
        </div>
      </div>
    </form>
  );
}
