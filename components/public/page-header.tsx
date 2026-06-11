import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** En-tete compact des pages internes (titre, sous-titre, fil d'Ariane). */
export function PageHeader({
  title,
  description,
  eyebrow,
  eyebrowIcon,
  breadcrumb,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  eyebrowIcon?: string;
  breadcrumb?: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-ojid-gray bg-ojid-gray/30",
        className,
      )}
    >
      <div className="absolute inset-0 bg-ojid-radial opacity-70" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <Container className="relative py-12 md:py-16">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-ojid-green">
              Accueil
            </Link>
            {breadcrumb.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <Icon name="ChevronRight" size={14} className="text-ojid-bluegray" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-ojid-green">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? (
          <span className="eyebrow">
            {eyebrowIcon ? <Icon name={eyebrowIcon} size={15} /> : null}
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-balance md:text-[2.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </section>
  );
}
