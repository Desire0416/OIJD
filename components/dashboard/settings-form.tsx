"use client";

import { useActionState } from "react";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { SiteSettings } from "@/lib/settings";

type FormState = { error?: string; success?: string };

export function SettingsForm({
  initial,
  action,
}: {
  initial: SiteSettings;
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="AlertTriangle" size={17} /> {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-ojid-green/30 bg-ojid-green/5 p-3 text-sm text-ojid-green-dark">
          <Icon name="CheckCircle2" size={17} /> {state.success}
        </div>
      ) : null}

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Identite & accroche</h3>
        <Field label="Phrase d'accroche (hero)">
          <Textarea name="heroPhrase" rows={2} defaultValue={initial.heroPhrase} />
        </Field>
        <Field label="Slogan" className="mt-4">
          <Input name="tagline" defaultValue={initial.tagline} />
        </Field>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Coordonnees publiques</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email de contact">
            <Input name="contactEmail" type="email" defaultValue={initial.contactEmail} />
          </Field>
          <Field label="Telephone">
            <Input name="contactPhone" defaultValue={initial.contactPhone} />
          </Field>
        </div>
        <Field label="Adresse" className="mt-4">
          <Input name="address" defaultValue={initial.address} />
        </Field>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Presynthese intelligente</h3>
        <Checkbox
          name="enableSmartScoring"
          defaultChecked={initial.enableSmartScoring}
          label="Activer le scoring et les dossiers recommandes"
        />
        <Field label="Seuil de declenchement (nombre de dossiers)" className="mt-4" hint="A partir de ce nombre, la section des dossiers recommandes apparait.">
          <Input name="smartScoringThreshold" type="number" min={1} defaultValue={String(initial.smartScoringThreshold)} className="max-w-[160px]" />
        </Field>
      </Card>

      <Button type="submit" loading={pending} icon="Check">
        Enregistrer les parametres
      </Button>
    </form>
  );
}
