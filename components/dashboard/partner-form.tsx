"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

type FormState = { error?: string };
type Initial = Record<string, string | boolean | number | undefined>;

export function PartnerForm({
  action,
  initial = {},
  submitLabel = "Enregistrer",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = (k: string) => (initial[k] !== undefined ? String(initial[k]) : "");

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      {state.error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      ) : null}
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom du partenaire" required>
            <Input name="name" defaultValue={v("name")} required />
          </Field>
          <Field label="Type de collaboration">
            <Input name="partnershipType" defaultValue={v("partnershipType")} placeholder="Institutionnel, technique..." />
          </Field>
          <Field label="Site web">
            <Input name="websiteUrl" type="url" defaultValue={v("websiteUrl")} placeholder="https://..." />
          </Field>
          <Field label="Logo (URL)">
            <Input name="logoUrl" defaultValue={v("logoUrl")} placeholder="https://..." />
          </Field>
          <Field label="Ordre d'affichage">
            <Input name="order" type="number" min={0} defaultValue={v("order") || "0"} />
          </Field>
        </div>
        <Field label="Description" className="mt-4">
          <Textarea name="description" rows={3} defaultValue={v("description")} />
        </Field>
        <div className="mt-4">
          <Checkbox name="isActive" defaultChecked={initial.isActive !== false} label="Partenaire actif (visible)" />
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={pending} icon="Check">
          {submitLabel}
        </Button>
        <Link href="/dashboard/partenaires" className={buttonVariants({ variant: "ghost" })}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
