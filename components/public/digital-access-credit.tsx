import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site-config";

/** Credit Digital Access - valorise avec serieux, sans voler l'identite OIJD. */
export function DigitalAccessCredit({
  className,
  variant = "muted",
}: {
  className?: string;
  variant?: "muted" | "card";
}) {
  if (variant === "card") {
    return (
      <Link
        href="/conception-realisation"
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl border border-digital-purple/20 bg-digital-purple/5 px-4 py-3 transition-colors hover:border-digital-purple/40",
          className,
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-digital-purple/10 text-digital-purple">
          <Icon name="Sparkles" size={18} />
        </span>
        <span className="text-sm">
          <span className="block text-xs text-muted">Conception &amp; realisation</span>
          <span className="font-semibold text-digital-purple">
            {siteConfig.digitalAccess.name}
          </span>
        </span>
        <Icon
          name="ArrowUpRight"
          size={16}
          className="text-digital-purple opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>
    );
  }
  return (
    <Link
      href="/conception-realisation"
      className={cn(
        "text-xs text-white/60 transition-colors hover:text-white/90",
        className,
      )}
    >
      {siteConfig.digitalAccess.credit}
    </Link>
  );
}
