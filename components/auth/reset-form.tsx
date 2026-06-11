"use client";

import { useActionState } from "react";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type AuthState = { error?: string; success?: string };

export function ResetForm({
  token,
  action,
}: {
  token: string;
  action: (prev: AuthState, fd: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      ) : null}
      <input type="hidden" name="token" value={token} />
      <Field label="Nouveau mot de passe" hint="Au moins 8 caracteres.">
        <Input name="password" type="password" required autoFocus />
      </Field>
      <Field label="Confirmer le mot de passe">
        <Input name="confirm" type="password" required />
      </Field>
      <Button type="submit" className="w-full" loading={pending} icon="KeyRound">
        Reinitialiser le mot de passe
      </Button>
    </form>
  );
}
