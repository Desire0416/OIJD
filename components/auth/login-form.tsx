"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type AuthState = { error?: string; success?: string };

export function LoginForm({
  from,
  action,
}: {
  from?: string;
  action: (prev: AuthState, fd: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="AlertTriangle" size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      ) : null}

      <input type="hidden" name="from" value={from ?? ""} />

      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required autoFocus placeholder="vous@oijd-civ.org" />
      </Field>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Mot de passe
          </label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-sm font-medium text-ojid-green hover:underline"
          >
            Oublie ?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            aria-label={show ? "Masquer" : "Afficher"}
          >
            <Icon name={show ? "Eye" : "Lock"} size={18} />
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" loading={pending} icon="Lock">
        Se connecter
      </Button>
    </form>
  );
}
