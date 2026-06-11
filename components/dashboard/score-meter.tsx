import { cn } from "@/lib/utils";
import { scoreBand, type Tone } from "@/lib/constants";

const FILL: Record<Tone, string> = {
  green: "bg-ojid-green",
  orange: "bg-ojid-orange",
  flame: "bg-ojid-flame",
  blue: "bg-sky-500",
  gray: "bg-slate-400",
  red: "bg-red-500",
  amber: "bg-amber-500",
  purple: "bg-violet-500",
  teal: "bg-teal-500",
};

export function ScoreMeter({
  score,
  showLabel = true,
}: {
  score: number | null | undefined;
  showLabel?: boolean;
}) {
  if (score === null || score === undefined) {
    return <span className="text-sm text-muted">Non evalue</span>;
  }
  const band = scoreBand(score);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-lg font-extrabold text-ink">
          {score}
          <span className="text-sm font-medium text-muted">/100</span>
        </span>
        {showLabel ? (
          <span className="text-xs font-semibold text-muted">{band.label}</span>
        ) : null}
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ojid-gray">
        <div
          className={cn("h-full rounded-full", FILL[band.tone])}
          style={{ width: `${Math.max(3, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined)
    return <span className="text-xs text-muted">-</span>;
  const band = scoreBand(score);
  const ring: Record<Tone, string> = {
    green: "border-ojid-green/30 text-ojid-green",
    orange: "border-ojid-orange/30 text-ojid-orange",
    flame: "border-ojid-flame/30 text-ojid-flame",
    blue: "border-sky-300 text-sky-600",
    gray: "border-slate-300 text-slate-500",
    red: "border-red-300 text-red-600",
    amber: "border-amber-300 text-amber-600",
    purple: "border-violet-300 text-violet-600",
    teal: "border-teal-300 text-teal-600",
  };
  return (
    <span
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-full border-2 px-1.5 font-heading text-sm font-bold",
        ring[band.tone],
      )}
      title={band.label}
    >
      {score}
    </span>
  );
}
