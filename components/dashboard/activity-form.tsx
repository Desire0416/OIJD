"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ACTIVITY_STATUS, ACTIVITY_STATUS_META } from "@/lib/constants";

type FormState = { error?: string };
type Initial = Record<string, string | boolean | undefined>;

export function ActivityForm({
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
          <Field label="Resume" className="mt-4">
            <Textarea name="excerpt" rows={2} defaultValue={v("excerpt")} />
          </Field>
          <Field label="Description" required className="mt-4">
            <Textarea name="description" rows={8} defaultValue={v("description")} required />
          </Field>
          <Field label="Objectifs" className="mt-4">
            <Textarea name="objectives" rows={3} defaultValue={v("objectives")} />
          </Field>
          <Field label="Resultats" className="mt-4">
            <Textarea name="results" rows={3} defaultValue={v("results")} />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="mb-4 font-heading font-bold text-ink">Organisation</h3>
          <Field label="Statut">
            <Select name="status" defaultValue={v("status") || "PLANNED"}>
              {ACTIVITY_STATUS.map((s) => (
                <option key={s} value={s}>
                  {ACTIVITY_STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Departement responsable" className="mt-4">
            <Select name="departmentId" defaultValue={v("departmentId")}>
              <option value="">Aucun</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lieu" className="mt-4">
            <Input name="location" defaultValue={v("location")} />
          </Field>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Date de debut">
              <Input type="date" name="startDate" defaultValue={v("startDate")} />
            </Field>
            <Field label="Date de fin">
              <Input type="date" name="endDate" defaultValue={v("endDate")} />
            </Field>
          </div>
          <div className="mt-4">
            <Checkbox name="featured" defaultChecked={Boolean(initial.featured)} label="Mettre en avant (accueil)" />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-heading font-bold text-ink">Medias & partenaires</h3>
          <Field label="Image de couverture (URL)">
            <Input name="coverImage" defaultValue={v("coverImage")} placeholder="https://..." />
          </Field>
          <Field label="Partenaires" className="mt-4" hint="Separes par des virgules.">
            <Input name="partners" defaultValue={v("partners")} />
          </Field>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} icon="Check">
            {submitLabel}
          </Button>
          <Link href="/dashboard/activites" className={buttonVariants({ variant: "ghost" })}>
            Annuler
          </Link>
        </div>
      </div>
    </form>
  );
}
