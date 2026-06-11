import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site-config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panneau de marque */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ojid-forest via-ojid-green-dark to-ojid-green lg:block">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-ojid-orange/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/">
            <Logo variant="dark" size={48} />
          </Link>
          <div>
            <h2 className="max-w-md font-heading text-3xl font-extrabold leading-tight">
              Espace de gestion de la plateforme OIJD
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              Pilotez les departements, les actualites, le centre des appels et le
              traitement des dossiers en toute securite.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: "ShieldCheck", label: "Acces securise" },
                { icon: "Users", label: "Roles & permissions" },
                { icon: "BarChart3", label: "Statistiques" },
              ].map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm"
                >
                  <Icon name={f.icon} size={15} className="text-ojid-orange-flame" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/55">
            {siteConfig.digitalAccess.creditPrivate}
          </p>
        </div>
      </div>

      {/* Zone formulaire */}
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-muted lg:hidden">
            {siteConfig.digitalAccess.creditPrivate}
          </p>
          <p className="mt-6 text-center text-sm">
            <Link href="/" className="text-muted hover:text-ojid-green">
              <Icon name="ArrowLeft" size={14} className="mr-1 inline" />
              Retour au site public
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
