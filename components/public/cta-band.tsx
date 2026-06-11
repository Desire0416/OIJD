import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaBand() {
  return (
    <Reveal className="container-x">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ojid-orange to-ojid-flame px-6 py-14 text-center text-white shadow-glow md:px-12">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Engagez-vous avec l'OIJD - Section CIV
          </h2>
          <p className="mt-3 text-white/90">
            Soumettez un dossier, suivez nos actualites ou rejoignez nos
            programmes. La jeunesse diplomatique se construit avec vous.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/appels"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "!bg-white !text-ojid-orange hover:!bg-white/90",
              })}
            >
              <Icon name="FileUp" size={18} />
              Soumettre un dossier
            </Link>
            <Link
              href="/actualites"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "!border-white/60 !bg-transparent !text-white hover:!bg-white/10",
              })}
            >
              Lire les actualites
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "!text-white hover:!bg-white/10",
              })}
            >
              Contacter l'OIJD
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
