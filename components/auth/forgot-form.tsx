"use client";

import { useActionState } from "react";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type AuthState = { error?: string; success?: string };

export function ForgotForm({
  action,
}: {
  action: (prev: AuthState, fd: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  if (state.success) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-ojid-green/30 bg-ojid-green/5 p-4 text-sm text-ojid-green-dark">
        <Icon name="MailCheck" size={18} className="mt-0.5 shrink-0" />
        {state.success}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}
      <Field label="Email">
        <Input name="email" type="email" required autoFocus />
      </Field>
      <Button type="submit" className="w-full" loading={pending} icon="Send">
        Envoyer le lien
      </Button>
    </form>
  );
}
