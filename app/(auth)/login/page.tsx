import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { LoginForm } from "@/components/auth/login-form";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Espace prive de la plateforme OIJD - Section CIV.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; reset?: string }>;
}) {
  const { from, reset } = await searchParams;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">
        Connexion a l'espace prive
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Acces reserve aux responsables et administrateurs habilites.
      </p>

      {reset ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-ojid-green/30 bg-ojid-green/5 p-3 text-sm text-ojid-green-dark">
          <Icon name="CheckCircle2" size={17} className="mt-0.5 shrink-0" />
          Mot de passe reinitialise. Vous pouvez vous connecter.
        </div>
      ) : null}

      <div className="mt-6">
        <LoginForm from={from} action={loginAction} />
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-ojid-gray bg-ojid-gray/30 p-3.5 text-xs text-muted">
        <p className="font-semibold text-ink">Compte de demonstration</p>
        <p className="mt-1">
          admin@oijd-civ.org / Admin@OIJD2026 (a modifier en production)
        </p>
      </div>
    </div>
  );
}
