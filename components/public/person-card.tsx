import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_META, type Role } from "@/lib/constants";
import { initials } from "@/lib/utils";

export type PersonCardData = {
  name: string;
  title?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  department?: { name: string } | null;
};

export function PersonCard({ person }: { person: PersonCardData }) {
  const roleMeta = person.role
    ? ROLE_META[person.role as Role]
    : undefined;
  return (
    <Card interactive className="flex h-full flex-col items-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ojid-green to-ojid-green-dark text-2xl font-bold text-white shadow-soft">
        {person.avatarUrl ? (
          <img
            src={person.avatarUrl}
            alt={person.name}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(person.name)
        )}
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-ink">
        {person.name}
      </h3>
      {person.title ? (
        <p className="mt-0.5 text-sm text-muted">{person.title}</p>
      ) : null}
      {person.department ? (
        <p className="mt-1 text-xs text-ojid-bluegray">
          {person.department.name}
        </p>
      ) : null}
      {roleMeta ? (
        <span className="mt-3">
          <Badge tone={roleMeta.tone}>{roleMeta.label}</Badge>
        </span>
      ) : null}
    </Card>
  );
}
