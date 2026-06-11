import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/constants";
import { Icon } from "@/components/ui/icon";

const TONES: Record<Tone, string> = {
  green: "bg-ojid-green/10 text-ojid-green ring-ojid-green/20",
  orange: "bg-ojid-orange/10 text-ojid-orange ring-ojid-orange/20",
  flame: "bg-ojid-flame/10 text-ojid-flame ring-ojid-flame/25",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
};

export function Badge({
  tone = "gray",
  children,
  icon,
  className,
  dot = false,
}: {
  tone?: Tone;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      ) : icon ? (
        <Icon name={icon} size={13} />
      ) : null}
      {children}
    </span>
  );
}
