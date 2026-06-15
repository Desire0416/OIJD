import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 text-center">
      <div aria-hidden className="absolute inset-0 bg-ojid-radial opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.25]" />
      <div className="relative">
        <Link href="/" aria-label="Accueil" className="inline-flex">
          <Logo size={56} />
        </Link>
        <p className="mt-10 font-heading text-7xl font-extrabold leading-none text-gradient-ojid">
          404
        </p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-ink">
          Page introuvable
        </h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          La page que vous recherchez n'existe pas ou a ete deplacee.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "primary" })}>
            <Icon name="Home" size={18} />
            Retour a l'accueil
          </Link>
          <Link href="/appels" className={buttonVariants({ variant: "outline" })}>
            Voir les appels
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
