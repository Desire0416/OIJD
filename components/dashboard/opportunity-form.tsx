"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Label } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
  OPPORTUNITY_STATUS,
  OPPORTUNITY_STATUS_META,
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_META,
} from "@/lib/constants";

type FormState = { error?: string };
type Initial = Record<string, string | boolean | undefined>;

export function OpportunityForm({
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
    <form action={formAction} className="space-y-6">
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}

      {state.error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      ) : null}

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Informations generales</h3>
        <Field label="Titre de l'appel" required>
          <Input name="title" defaultValue={v("title")} required />
        </Field>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Type">
            <Select name="type" defaultValue={v("type") || "PROJECT_CALL"}>
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {OPPORTUNITY_TYPE_META[t].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Statut">
            <Select name="status" defaultValue={v("status") || "DRAFT"}>
              {OPPORTUNITY_STATUS.map((s) => (
                <option key={s} value={s}>
                  {OPPORTUNITY_STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Departement">
            <Select name="departmentId" defaultValue={v("departmentId")}>
              <option value="">Aucun</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Resume" className="mt-4">
          <Textarea name="summary" rows={2} defaultValue={v("summary")} />
        </Field>
        <div className="mt-4">
          <Checkbox name="featured" defaultChecked={Boolean(initial.featured)} label="Mettre en avant sur le site public" />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Contenu</h3>
        <div className="space-y-4">
          <Field label="Contexte">
            <Textarea name="context" rows={3} defaultValue={v("context")} />
          </Field>
          <Field label="Objectifs">
            <Textarea name="objectives" rows={3} defaultValue={v("objectives")} />
          </Field>
          <Field label="Public cible">
            <Input name="targetAudience" defaultValue={v("targetAudience")} />
          </Field>
          <Field label="Conditions d'eligibilite">
            <Textarea name="eligibility" rows={2} defaultValue={v("eligibility")} />
          </Field>
          <Field label="Criteres de selection">
            <Textarea name="selectionCriteria" rows={2} defaultValue={v("selectionCriteria")} />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Pieces, scoring & calendrier</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Pieces a fournir"
            hint="Une par ligne. Genere aussi les zones d'upload du formulaire."
          >
            <Textarea name="requiredDocuments" rows={4} defaultValue={v("requiredDocuments")} />
          </Field>
          <Field
            label="Mots-cles de scoring"
            hint="Separes par des virgules. Utilises par la presynthese."
          >
            <Textarea name="keywords" rows={4} defaultValue={v("keywords")} />
          </Field>
          <Field label="Date d'ouverture">
            <Input type="date" name="openingDate" defaultValue={v("openingDate")} />
          </Field>
          <Field label="Date limite">
            <Input type="date" name="deadline" defaultValue={v("deadline")} />
          </Field>
          <Field label="Calendrier du processus" className="sm:col-span-2">
            <Textarea name="processCalendar" rows={2} defaultValue={v("processCalendar")} />
          </Field>
          <Field label="Modalites de soumission" className="sm:col-span-2">
            <Textarea name="submissionGuidelines" rows={2} defaultValue={v("submissionGuidelines")} />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-heading font-bold text-ink">Contact & localisation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contacts utiles">
            <Input name="contactInfo" defaultValue={v("contactInfo")} />
          </Field>
          <Field label="Domaine">
            <Input name="domain" defaultValue={v("domain")} />
          </Field>
          <Field label="Pays">
            <Input name="country" defaultValue={v("country") || "Cote d'Ivoire"} />
          </Field>
          <Field label="Ville">
            <Input name="city" defaultValue={v("city")} />
          </Field>
          <Field label="Niveau d'etude vise">
            <Input name="educationLevel" defaultValue={v("educationLevel")} />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={pending} icon="Check">
          {submitLabel}
        </Button>
        <Link href="/dashboard/appels" className={buttonVariants({ variant: "ghost" })}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
