"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/field";

type Result =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function ContactForm({
  departments,
  action,
}: {
  departments: { id: string; name: string }[];
  action: (formData: FormData) => Promise<Result>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [website, setWebsite] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const res = await action(fd);
      setResult(res);
      if (!res.ok && res.fieldErrors) setErrors(res.fieldErrors);
      if (res.ok) (e.target as HTMLFormElement).reset();
    });
  }

  if (result?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-ojid-green/30 bg-white p-8 text-center shadow-card"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ojid-green/10 text-ojid-green">
          <Icon name="MailCheck" size={28} />
        </div>
        <h3 className="mt-4 font-heading text-xl font-bold">Message envoye</h3>
        <p className="mt-2 text-muted">
          Merci de nous avoir contactes. Notre equipe vous repondra dans les
          meilleurs delais.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setResult(null)}
          icon="ArrowLeft"
        >
          Envoyer un autre message
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-ojid-gray bg-white p-6 shadow-card md:p-8"
    >
      {result && !result.ok ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-700">
          <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{result.error}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet" required error={errors.name}>
          <Input name="name" required />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input name="email" type="email" required />
        </Field>
        <Field label="Telephone">
          <Input name="phone" type="tel" />
        </Field>
        <Field label="Departement concerne">
          <Select name="departmentId" defaultValue="">
            <option value="">General</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Objet" required error={errors.subject} className="mt-4">
        <Input name="subject" required />
      </Field>
      <Field label="Message" required error={errors.message} className="mt-4">
        <Textarea name="message" rows={5} required />
      </Field>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <Button type="submit" className="mt-6 w-full" loading={pending} icon="Send">
        Envoyer le message
      </Button>
    </form>
  );
}
