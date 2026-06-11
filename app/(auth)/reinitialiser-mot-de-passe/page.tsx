import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ResetForm } from "@/components/auth/reset-form";
import { resetPasswordAction } from "../actions";

export const metadata: Metadata = {
  title: "Reinitialiser le mot de passe",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-ink">
          Lien invalide
        </h1>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800">
          <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0" />
          Ce lien de reinitialisation est invalide. Veuillez refaire une demande.
        </div>
        <p className="mt-6 text-center text-sm">
          <Link
            href="/mot-de-passe-oublie"
            className="font-medium text-ojid-green hover:underline"
          >
            Demander un nouveau lien
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">
        Nouveau mot de passe
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Choisissez un nouveau mot de passe securise.
      </p>
      <div className="mt-6">
        <ResetForm token={token} action={resetPasswordAction} />
      </div>
    </div>
  );
}
