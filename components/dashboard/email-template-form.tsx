"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

type FormState = { error?: string };

const VARIABLES = [
  "candidateName",
  "submissionTitle",
  "callTitle",
  "callType",
  "reference",
  "status",
  "nextStep",
  "deadline",
  "organizationName",
  "contactEmail",
  "platformUrl",
];

export function EmailTemplateForm({
  templateKey,
  initial,
  action,
}: {
  templateKey: string;
  initial: { subject: string; bodyHtml: string; isActive: boolean };
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <input type="hidden" name="key" value={templateKey} />
      <div className="space-y-6">
        {state.error ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
            {state.error}
          </div>
        ) : null}
        <Card className="p-5">
          <Field label="Objet de l'email" required>
            <Input name="subject" defaultValue={initial.subject} required />
          </Field>
          <Field label="Contenu (HTML)" required className="mt-4" hint="HTML simple ou texte avec variables {{...}}.">
            <Textarea name="bodyHtml" rows={14} defaultValue={initial.bodyHtml} required className="font-mono text-xs" />
          </Field>
          <div className="mt-4">
            <Checkbox name="isActive" defaultChecked={initial.isActive} label="Modele actif" />
          </div>
        </Card>
        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} icon="Check">
            Enregistrer le modele
          </Button>
          <Link href="/dashboard/emails" className={buttonVariants({ variant: "ghost" })}>
            Annuler
          </Link>
        </div>
      </div>

      <Card className="h-fit p-5">
        <h3 className="flex items-center gap-2 font-heading font-bold text-ink">
          <Icon name="Braces" size={17} className="text-ojid-green" />
          Variables disponibles
        </h3>
        <p className="mt-1 text-sm text-muted">Inserez-les avec doubles accolades.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {VARIABLES.map((v) => (
            <li key={v}>
              <code className="rounded-md bg-ojid-gray px-2 py-1 text-xs text-ink">{`{{${v}}}`}</code>
            </li>
          ))}
        </ul>
      </Card>
    </form>
  );
}
