import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { CoverPlaceholder } from "@/components/ui/cover-placeholder";
import { formatDate, truncate } from "@/lib/utils";

export type NewsCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  category?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  department?: { name: string } | null;
};

export function NewsCard({ news }: { news: NewsCardData }) {
  const summary =
    news.excerpt || (news.content ? truncate(news.content, 130) : "");
  const date = news.publishedAt ?? news.createdAt;
  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link href={`/actualites/${news.slug}`} className="block">
        <div className="relative h-44 w-full overflow-hidden">
          {news.coverImage ? (
            <img
              src={news.coverImage}
              alt={news.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <CoverPlaceholder
              seed={news.slug}
              icon="Newspaper"
              className="h-full w-full"
            />
          )}
          {news.category ? (
            <span className="absolute left-3 top-3">
              <Badge tone="orange">{news.category}</Badge>
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Icon name="CalendarDays" size={14} />
          {formatDate(date)}
          {news.department ? (
            <>
              <span className="text-ojid-gray">•</span>
              <span className="truncate">{news.department.name}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-ojid-green">
          <Link href={`/actualites/${news.slug}`}>{news.title}</Link>
        </h3>
        {summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {summary}
          </p>
        ) : null}
        <Link
          href={`/actualites/${news.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ojid-green"
        >
          Lire la suite
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
