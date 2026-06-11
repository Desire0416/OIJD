import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { Tone } from "@/lib/constants";

const TONES: Record<Tone, string> = {
  green: "bg-ojid-green/10 text-ojid-green",
  orange: "bg-ojid-orange/10 text-ojid-orange",
  flame: "bg-ojid-flame/10 text-ojid-flame",
  blue: "bg-sky-50 text-sky-600",
  gray: "bg-slate-100 text-slate-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-violet-50 text-violet-600",
  teal: "bg-teal-50 text-teal-600",
};

export function StatCard({
  label,
  value,
  icon,
  tone = "green",
  hint,
  href,
}: {
  label: string;
  value: number | string;
  icon: string;
  tone?: Tone;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-ojid-gray bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          TONES[tone],
        )}
      >
        <Icon name={icon} size={22} />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-2xl font-extrabold leading-none text-ink">
          {value}
        </p>
        <p className="mt-1 truncate text-sm text-muted">{label}</p>
        {hint ? <p className="text-xs text-ojid-bluegray">{hint}</p> : null}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
