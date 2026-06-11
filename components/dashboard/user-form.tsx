"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ROLES, ROLE_META, USER_STATUS, USER_STATUS_META } from "@/lib/constants";

type FormState = { error?: string };
type Initial = Record<string, string | undefined>;

export function UserForm({
  action,
  departments,
  initial = {},
  isEdit = false,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  departments: { id: string; name: string }[];
  initial?: Initial;
  isEdit?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = (k: string) => initial[k] ?? "";

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
          <Field label="Nom complet" required>
            <Input name="name" defaultValue={v("name")} required />
          </Field>
          <Field label="Email" required>
            <Input name="email" type="email" defaultValue={v("email")} required />
          </Field>
          <Field label="Role">
            <Select name="role" defaultValue={v("role") || "INTERNAL_READER"}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_META[r].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Statut">
            <Select name="status" defaultValue={v("status") || "ACTIVE"}>
              {USER_STATUS.map((s) => (
                <option key={s} value={s}>
                  {USER_STATUS_META[s].label}
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
          <Field label="Fonction / titre">
            <Input name="title" defaultValue={v("title")} placeholder="Ex: Responsable communication" />
          </Field>
          <Field label="Telephone">
            <Input name="phone" defaultValue={v("phone")} />
          </Field>
          <Field
            label={isEdit ? "Nouveau mot de passe" : "Mot de passe"}
            required={!isEdit}
            hint={isEdit ? "Laisser vide pour conserver l'actuel." : "Au moins 8 caracteres."}
          >
            <Input name="password" type="password" autoComplete="new-password" />
          </Field>
        </div>
        <Field label="Biographie" className="mt-4">
          <Textarea name="bio" rows={3} defaultValue={v("bio")} />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={pending} icon="Check">
          {isEdit ? "Enregistrer" : "Creer l'utilisateur"}
        </Button>
        <Link href="/dashboard/utilisateurs" className={buttonVariants({ variant: "ghost" })}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
