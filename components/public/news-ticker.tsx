"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

type TickerItem = { title: string; slug: string; category?: string | null };

export function NewsTicker({ items }: { items: TickerItem[] }) {
  if (!items.length) return null;
  // Duplication pour boucle sans couture (-50% translateX)
  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrap relative overflow-hidden border-b border-ojid-green-dark/20 bg-ojid-green-dark">
      <div className="flex items-stretch h-10">
        {/* Badge fixe */}
        <div className="z-10 shrink-0 flex items-center gap-1.5 bg-ojid-orange px-4 text-[11px] font-bold uppercase tracking-widest text-white">
          <Icon name="Newspaper" size={13} />
          Actu
        </div>

        {/* Piste défilante */}
        <div className="ticker-track flex-1 overflow-hidden">
          <div className="animate-ticker inline-flex whitespace-nowrap will-change-transform">
            {doubled.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/actualites/${item.slug}`}
                className="inline-flex items-center gap-2 px-5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <span className="h-1 w-1 rounded-full bg-ojid-orange-flame shrink-0" />
                {item.category ? (
                  <span className="text-ojid-orange-flame font-semibold text-xs uppercase tracking-wide">
                    {item.category}
                  </span>
                ) : null}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
