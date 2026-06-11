import Link from "next/link";
import { Input, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { SUBMISSION_STATUS, SUBMISSION_STATUS_META } from "@/lib/constants";

export function DossierFilters({
  opportunities,
  current,
}: {
  opportunities: { id: string; title: string }[];
  current: { q?: string; statut?: string; appel?: string; sort?: string };
}) {
  return (
    <form
      method="GET"
      action="/dashboard/dossiers"
      className="grid gap-3 rounded-2xl border border-ojid-gray bg-white p-4 shadow-card md:grid-cols-[1.4fr_1fr_1.2fr_1fr_auto]"
    >
      <div className="relative">
        <Icon
          name="Search"
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <Input
          name="q"
          defaultValue={current.q ?? ""}
          placeholder="Nom, email, reference..."
          className="pl-9"
        />
      </div>
      <Select name="statut" defaultValue={current.statut ?? ""} aria-label="Statut">
        <option value="">Tous les statuts</option>
        {SUBMISSION_STATUS.map((s) => (
          <option key={s} value={s}>
            {SUBMISSION_STATUS_META[s].label}
          </option>
        ))}
      </Select>
      <Select name="appel" defaultValue={current.appel ?? ""} aria-label="Appel">
        <option value="">Tous les appels</option>
        {opportunities.map((o) => (
          <option key={o.id} value={o.id}>
            {o.title}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={current.sort ?? "recent"} aria-label="Tri">
        <option value="recent">Plus recents</option>
        <option value="score">Score decroissant</option>
        <option value="oldest">Plus anciens</option>
      </Select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-ojid-green px-4 font-semibold text-white hover:bg-ojid-green-dark"
        >
          <Icon name="Filter" size={17} />
        </button>
        <Link
          href="/dashboard/dossiers"
          className="inline-flex h-11 items-center rounded-xl border border-ojid-gray px-3 text-muted hover:text-ink"
          aria-label="Reinitialiser"
        >
          <Icon name="X" size={18} />
        </Link>
      </div>
    </form>
  );
}
