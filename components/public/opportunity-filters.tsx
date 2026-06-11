import Link from "next/link";
import { Input, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { OPPORTUNITY_GROUPS } from "@/lib/constants";

const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Ouverts" },
  { value: "SCHEDULED", label: "Bientot ouverts" },
  { value: "CLOSED", label: "Clotures" },
  { value: "UNDER_REVIEW", label: "En analyse" },
  { value: "RESULTS_PUBLISHED", label: "Resultats publies" },
];

export function OpportunityFilters({
  departments,
  current,
}: {
  departments: { slug: string; name: string }[];
  current: { q?: string; group?: string; statut?: string; departement?: string };
}) {
  return (
    <form
      method="GET"
      action="/appels"
      className="rounded-2xl border border-ojid-gray bg-white p-4 shadow-card md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="Rechercher un appel..."
            className="pl-10"
            aria-label="Rechercher"
          />
        </div>
        <Select name="group" defaultValue={current.group ?? ""} aria-label="Type">
          <option value="">Tous les types</option>
          {OPPORTUNITY_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
        <Select name="statut" defaultValue={current.statut ?? ""} aria-label="Statut">
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <Select
          name="departement"
          defaultValue={current.departement ?? ""}
          aria-label="Departement"
        >
          <option value="">Tous les departements</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ojid-green px-4 font-semibold text-white transition-colors hover:bg-ojid-green-dark"
          >
            <Icon name="Filter" size={17} />
            <span className="md:sr-only lg:not-sr-only">Filtrer</span>
          </button>
          <Link
            href="/appels"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-ojid-gray px-3 text-muted transition-colors hover:text-ink"
            aria-label="Reinitialiser"
          >
            <Icon name="X" size={18} />
          </Link>
        </div>
      </div>
    </form>
  );
}
