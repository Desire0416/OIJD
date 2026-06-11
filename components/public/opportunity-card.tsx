import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  OPPORTUNITY_STATUS_META,
  OPPORTUNITY_TYPE_META,
  type OpportunityStatus,
  type OpportunityType,
} from "@/lib/constants";
import { daysUntil, formatDate, formatDeadline, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type OpportunityCardData = {
  slug: string;
  title: string;
  summary?: string | null;
  type: string;
  status: string;
  deadline?: Date | string | null;
  city?: string | null;
  country?: string | null;
  department?: { name: string } | null;
};

export function OpportunityCard({ opp }: { opp: OpportunityCardData }) {
  const typeMeta = OPPORTUNITY_TYPE_META[opp.type as OpportunityType];
  const statusMeta = OPPORTUNITY_STATUS_META[opp.status as OpportunityStatus];
  const isOpen = opp.status === "PUBLISHED";
  const days = daysUntil(opp.deadline);
  const urgent = isOpen && days !== null && days >= 0 && days <= 7;

  return (
    <Card
      interactive
      className={cn(
        "group flex h-full flex-col p-5",
        isOpen && "ring-1 ring-ojid-green/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ojid-green/10 text-ojid-green">
          <Icon name={typeMeta?.icon ?? "FileText"} size={20} />
        </span>
        {statusMeta ? (
          <Badge tone={statusMeta.tone} dot>
            {statusMeta.label}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-ojid-orange">
        {typeMeta?.label ?? "Appel"}
      </div>
      <h3 className="mt-1 font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-ojid-green">
        <Link href={`/appels/${opp.slug}`}>{opp.title}</Link>
      </h3>
      {opp.summary ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {truncate(opp.summary, 140)}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        {opp.department ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Building2" size={14} />
            {opp.department.name}
          </span>
        ) : null}
        {opp.city || opp.country ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon name="MapPin" size={14} />
            {[opp.city, opp.country].filter(Boolean).join(", ")}
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ojid-gray pt-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium",
            urgent ? "text-ojid-orange" : "text-muted",
          )}
        >
          <Icon name={urgent ? "Clock" : "Calendar"} size={14} />
          {isOpen ? formatDeadline(opp.deadline) : statusMeta?.label}
        </span>
        <Link
          href={`/appels/${opp.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ojid-green"
        >
          {isOpen ? typeMeta?.actionLabel ?? "Voir" : "Voir les details"}
          <Icon
            name="ArrowRight"
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </Card>
  );
}
