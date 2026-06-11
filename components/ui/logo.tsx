import { cn } from "@/lib/utils";

/**
 * Logo officiel de l'OIJD (vrai SVG : embleme globe + flamme + ruban + "OIJD").
 * - variant "light" : sur fond clair (le SVG a un fond blanc, il se fond dans l'en-tete).
 * - variant "dark"  : sur fond fonce, le logo est pose sur une pastille blanche arrondie.
 */
export function Logo({
  variant = "light",
  showTagline = true,
  size = 44,
  className,
}: {
  variant?: "light" | "dark";
  showTagline?: boolean;
  size?: number;
  className?: string;
}) {
  const mark = (
    <img
      src="/brand/logo.svg"
      alt="OIJD - Organisation Internationale de la Jeunesse Diplomatique"
      style={{ height: size, width: "auto" }}
      className="block select-none"
      draggable={false}
    />
  );

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {variant === "dark" ? (
        <span className="inline-flex shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-sm">
          {mark}
        </span>
      ) : (
        mark
      )}
      {showTagline ? (
        <span
          className={cn(
            "font-heading text-[11px] font-extrabold uppercase tracking-[0.2em]",
            variant === "dark" ? "text-white/85" : "text-ojid-green-dark",
          )}
        >
          Section CIV
        </span>
      ) : null}
    </span>
  );
}
