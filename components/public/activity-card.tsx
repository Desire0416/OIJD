import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { CoverPlaceholder } from "@/components/ui/cover-placeholder";
import { ACTIVITY_STATUS_META, type ActivityStatus } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";

export type ActivityCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  description?: string | null;
  coverImage?: string | null;
  status: string;
  startDate?: Date | string | null;
  location?: string | null;
  department?: { name: string } | null;
};

export function ActivityCard({ activity }: { activity: ActivityCardData }) {
  const meta = ACTIVITY_STATUS_META[activity.status as ActivityStatus];
  const summary =
    activity.excerpt ||
    (activity.description ? truncate(activity.description, 120) : "");
  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link href={`/activites/${activity.slug}`} className="block">
        <div className="relative h-40 w-full overflow-hidden">
          {activity.coverImage ? (
            <img
              src={activity.coverImage}
              alt={activity.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <CoverPlaceholder
              seed={activity.slug}
              icon="CalendarCheck"
              className="h-full w-full"
            />
          )}
          {meta ? (
            <span className="absolute right-3 top-3">
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-ojid-green">
          <Link href={`/activites/${activity.slug}`}>{activity.title}</Link>
        </h3>
        {summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
          {activity.startDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="CalendarDays" size={14} />
              {formatDate(activity.startDate)}
            </span>
          ) : null}
          {activity.location ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="MapPin" size={14} />
              {activity.location}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
