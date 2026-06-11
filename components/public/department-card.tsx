import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export type DepartmentCardData = {
  slug: string;
  name: string;
  shortDescription?: string | null;
  icon?: string | null;
};

export function DepartmentCard({ dept }: { dept: DepartmentCardData }) {
  return (
    <Card interactive className="group h-full p-5">
      <Link href={`/departements/${dept.slug}`} className="flex h-full flex-col">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ojid-green/12 to-ojid-orange/10 text-ojid-green">
          <Icon name={dept.icon ?? "Building2"} size={22} />
        </span>
        <h3 className="mt-4 font-heading text-base font-bold text-ink transition-colors group-hover:text-ojid-green">
          {dept.name}
        </h3>
        {dept.shortDescription ? (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">
            {dept.shortDescription}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ojid-green">
          Decouvrir
          <Icon
            name="ArrowRight"
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </Card>
  );
}
