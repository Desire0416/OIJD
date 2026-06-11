"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { UploadField } from "@/components/forms/upload-field";
import { cn } from "@/lib/utils";
import type {
  FormSchema,
  SchemaField,
  SubmitResult,
} from "@/lib/submission-types";

type FormCategory = "CANDIDACY" | "PROJECT" | "TENDER" | "CONTEST";

const STEPS = ["Identite", "Dossier", "Pieces & envoi"];

export function DynamicSubmissionForm({
  slug,
  title,
  actionLabel,
  formCategory,
  schema,
  requiredDocs,
  action,
}: {
  slug: string;
  title: string;
  actionLabel: string;
  formCategory: FormCategory;
  schema: FormSchema;
  requiredDocs: string[];
  action: (formData: FormData) => Promise<SubmitResult>;
}) {
  const isOrgDefault = formCategory === "PROJECT" || formCategory === "TENDER";
  const [step, setStep] = useState(0);
  const [submitterType, setSubmitterType] = useState<
    "INDIVIDUAL" | "ORGANIZATION"
  >(isOrgDefault ? "ORGANIZATION" : "INDIVIDUAL");
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (name: string, v: string) =>
    setValues((p) => ({ ...p, [name]: v }));

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (submitterType === "INDIVIDUAL") {
        if (!values.firstName?.trim()) e.firstName = "Prenom requis.";
        if (!values.lastName?.trim()) e.lastName = "Nom requis.";
      } else if (!values.organizationName?.trim()) {
        e.organizationName = "Nom de l'organisation requis.";
      }
      if (!values.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
        e.email = "Email valide requis.";
    }
    if (s === 1) {
      for (const f of schema.fields) {
        if (f.required && !values[f.name]?.trim())
          e[f.name] = `${f.label} requis.`;
      }
    }
    if (s === 2) {
      if (!consent) e.consent = "Vous devez accepter le traitement de vos donnees.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prev() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    if (!validateStep(2)) return;
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("submitterType", submitterType);
    fd.set("website", website);
    fd.set("consent", consent ? "on" : "");
    for (const k of ["firstName", "lastName", "organizationName", "email", "phone", "country", "city"]) {
      fd.set(k, values[k] ?? "");
    }
    for (const f of schema.fields) fd.set(f.name, values[f.name] ?? "");
    const labels: string[] = [];
    requiredDocs.forEach((label, i) => {
      const file = files[i];
      if (file) {
        fd.append("documents", file);
        labels.push(label);
      }
    });
    fd.set("documentLabels", JSON.stringify(labels));

    startTransition(async () => {
      const res = await action(fd);
      setResult(res);
      if (res.ok) window.scrollTo({ top: 0, behavior: "smooth" });
      else if (res.fieldErrors) setErrors(res.fieldErrors);
    });
  }

  if (result?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-ojid-green/30 bg-white p-8 text-center shadow-card md:p-12"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ojid-green/10 text-ojid-green">
          <Icon name="CheckCircle2" size={34} />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold">
          Dossier soumis avec succes
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Votre dossier a bien ete enregistre. Un email de confirmation vous a ete
          adresse. Conservez votre reference de suivi.
        </p>
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-ojid-gray px-5 py-3 font-mono text-lg font-bold text-ink">
          <Icon name="Flag" size={18} className="text-ojid-orange" />
          {result.reference}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/appels" className={buttonVariants({ variant: "primary" })}>
            Voir d'autres appels
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Retour a l'accueil
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Indicateur d'etapes */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  i < step
                    ? "bg-ojid-green text-white"
                    : i === step
                      ? "bg-ojid-orange text-white"
                      : "bg-ojid-gray text-muted",
                )}
              >
                {i < step ? <Icon name="Check" size={16} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-semibold sm:block",
                  i === step ? "text-ink" : "text-muted",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <div
                className={cn(
                  "mx-3 h-0.5 flex-1 rounded transition-colors",
                  i < step ? "bg-ojid-green" : "bg-ojid-gray",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      {result && !result.ok ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <Icon name="AlertTriangle" size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm">{result.error}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-ojid-gray bg-white p-6 shadow-card md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 ? (
              <div className="space-y-5">
                <h2 className="font-heading text-xl font-bold">Vos coordonnees</h2>
                <div className="flex gap-2">
                  {(["INDIVIDUAL", "ORGANIZATION"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSubmitterType(t)}
                      className={cn(
                        "flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                        submitterType === t
                          ? "border-ojid-green bg-ojid-green/10 text-ojid-green"
                          : "border-ojid-gray text-muted hover:border-ojid-green/40",
                      )}
                    >
                      {t === "INDIVIDUAL" ? "Particulier" : "Organisation / Entreprise"}
                    </button>
                  ))}
                </div>
                {submitterType === "INDIVIDUAL" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Prenom" required error={errors.firstName}>
                      <Input
                        value={values.firstName ?? ""}
                        onChange={(e) => set("firstName", e.target.value)}
                      />
                    </Field>
                    <Field label="Nom" required error={errors.lastName}>
                      <Input
                        value={values.lastName ?? ""}
                        onChange={(e) => set("lastName", e.target.value)}
                      />
                    </Field>
                  </div>
                ) : (
                  <Field label="Nom de l'organisation / entreprise" required error={errors.organizationName}>
                    <Input
                      value={values.organizationName ?? ""}
                      onChange={(e) => set("organizationName", e.target.value)}
                    />
                  </Field>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" required error={errors.email}>
                    <Input
                      type="email"
                      value={values.email ?? ""}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Telephone">
                    <Input
                      type="tel"
                      value={values.phone ?? ""}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>
                  <Field label="Pays">
                    <Input
                      value={values.country ?? ""}
                      onChange={(e) => set("country", e.target.value)}
                    />
                  </Field>
                  <Field label="Ville">
                    <Input
                      value={values.city ?? ""}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <h2 className="font-heading text-xl font-bold">
                  Informations du dossier
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {schema.fields.map((f) => (
                    <DynamicField
                      key={f.name}
                      field={f}
                      value={values[f.name] ?? ""}
                      error={errors[f.name]}
                      onChange={(v) => set(f.name, v)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <h2 className="font-heading text-xl font-bold">Pieces justificatives</h2>
                {requiredDocs.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {requiredDocs.map((doc, i) => (
                      <UploadField
                        key={i}
                        label={doc}
                        onChange={(file) =>
                          setFiles((p) => ({ ...p, [i]: file }))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    Aucune piece obligatoire pour cet appel.
                  </p>
                )}

                {/* Honeypot anti-spam (cache) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="rounded-xl bg-ojid-gray/40 p-4">
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label="J'accepte que mes donnees et documents soient traites par l'OIJD - Section CIV dans le cadre de cet appel, de maniere confidentielle."
                  />
                  {errors.consent ? (
                    <p className="mt-1.5 text-sm font-medium text-red-600">
                      {errors.consent}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ojid-gray pt-6">
          {step > 0 ? (
            <Button variant="ghost" type="button" onClick={prev} icon="ArrowLeft">
              Precedent
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} iconRight="ArrowRight">
              Suivant
            </Button>
          ) : (
            <Button type="button" onClick={submit} loading={pending} icon="Send">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DynamicField({
  field,
  value,
  error,
  onChange,
}: {
  field: SchemaField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const full = field.type === "textarea";
  return (
    <Field
      label={field.label}
      required={field.required}
      error={error}
      hint={field.hint}
      className={full ? "sm:col-span-2" : undefined}
    >
      {field.type === "textarea" ? (
        <Textarea
          value={value}
          rows={4}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selectionner...</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}
