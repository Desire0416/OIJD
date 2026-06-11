import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "@/components/auth/forgot-form";
import { forgotPasswordAction } from "../actions";

export const metadata: Metadata = {
  title: "Mot de passe oublie",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">
        Mot de passe oublie
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Saisissez votre email : un lien de reinitialisation vous sera envoye.
      </p>
      <div className="mt-6">
        <ForgotForm action={forgotPasswordAction} />
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-medium text-ojid-green hover:underline">
          Retour a la connexion
        </Link>
      </p>
    </div>
  );
}
