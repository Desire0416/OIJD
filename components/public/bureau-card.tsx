import { cn, initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BureauMember } from "@/lib/site-config";

type Tone = "president" | "vp" | "dir";

const AVATAR_TONE: Record<Tone, string> = {
  president: "from-ojid-green to-ojid-forest",
  vp:        "from-ojid-orange to-[#c93d00]",
  dir:       "from-ojid-bluegray to-[#4a7a73]",
};

const BADGE_TONE: Record<Tone, string> = {
  president: "bg-ojid-green/10 text-ojid-green border-ojid-green/20",
  vp:        "bg-ojid-orange/10 text-ojid-orange border-ojid-orange/20",
  dir:       "bg-ojid-bluegray/10 text-ojid-bluegray border-ojid-bluegray/20",
};

export function BureauCard({
  member,
  tone = "dir",
}: {
  member: BureauMember & { photo?: string };
  tone?: Tone;
}) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-ojid-gray bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ojid-green/20 hover:shadow-lift">
      {/* Avatar / Photo */}
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-xl font-bold text-white shadow-soft",
          AVATAR_TONE[tone],
        )}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          initials(member.name)
        )}
      </div>

      {/* Nom */}
      <h3 className="mt-3.5 font-heading text-[0.92rem] font-extrabold uppercase tracking-wide text-ink">
        {member.name}
      </h3>

      {/* Badge titre */}
      <span
        className={cn(
          "mt-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
          BADGE_TONE[tone],
        )}
      >
        {member.title}
      </span>

      {/* Mission */}
      <p className="mt-2 text-xs leading-snug text-muted">{member.mission}</p>
    </div>
  );
}
