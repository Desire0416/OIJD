import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { DigitalAccessCredit } from "@/components/public/digital-access-credit";
import { publicNav, legalNav, siteConfig } from "@/lib/site-config";

const exploreLinks = publicNav.filter((n) => n.href !== "/");

const callLinks = [
  { label: "Tous les appels", href: "/appels" },
  { label: "Appels a projets", href: "/appels?group=Projets" },
  { label: "Appels a candidatures", href: "/appels?group=Candidatures" },
  { label: "Appels d'offres", href: "/appels?group=Offres+%26+prestations" },
];

export function PublicFooter() {
  return (
    <footer className="relative mt-24 bg-ojid-forest text-white">
      <div className="ribbon-divider" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <Logo variant="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {siteConfig.fullName} - {siteConfig.section}. Une jeunesse engagee
            pour la diplomatie, la cooperation et le leadership responsable.
          </p>
          <div className="mt-5 flex gap-2.5">
            {siteConfig.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-ojid-orange hover:text-white"
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white/90">
            Explorer
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white/90">
            Appels &amp; opportunites
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {callLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white/90">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <Icon name="MapPin" size={17} className="mt-0.5 text-ojid-orange" />
              {siteConfig.contact.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="Mail" size={17} className="mt-0.5 text-ojid-orange" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="Phone" size={17} className="mt-0.5 text-ojid-orange" />
              {siteConfig.contact.phone}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center gap-3 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-4">
            <p className="text-xs text-white/55">
              &copy; {new Date().getFullYear()} OIJD - {siteConfig.section}. Tous
              droits reserves.
            </p>
            <ul className="flex items-center gap-4">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <DigitalAccessCredit />
        </div>
      </div>
    </footer>
  );
}
