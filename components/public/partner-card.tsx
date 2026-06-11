import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { initials } from "@/lib/utils";

export type PartnerCardData = {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  partnershipType?: string | null;
};

export function PartnerCard({ partner }: { partner: PartnerCardData }) {
  const inner = (
    <Card interactive className="flex h-full flex-col items-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-ojid-gray/60">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="font-heading text-xl font-bold text-ojid-green">
            {initials(partner.name)}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-ink">
        {partner.name}
      </h3>
      {partner.partnershipType ? (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ojid-orange">
          {partner.partnershipType}
        </p>
      ) : null}
      {partner.description ? (
        <p className="mt-2 line-clamp-3 text-sm text-muted">
          {partner.description}
        </p>
      ) : null}
      {partner.websiteUrl ? (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ojid-green">
          Site officiel <Icon name="ExternalLink" size={13} />
        </span>
      ) : null}
    </Card>
  );

  if (partner.websiteUrl) {
    return (
      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}
