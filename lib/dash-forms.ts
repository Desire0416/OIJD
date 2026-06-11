import { toJson } from "@/lib/json";

/** Convertit une valeur de formulaire en Date (ou null). */
export function toDate(v: FormDataEntryValue | null | undefined): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Lignes (textarea) -> JSON array de chaines non vides. */
export function linesToJson(v: FormDataEntryValue | null | undefined): string {
  const s = v ? String(v) : "";
  const arr = s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return toJson(arr);
}

/** Valeurs separees par des virgules -> tableau. */
export function csvToArray(v: FormDataEntryValue | null | undefined): string[] {
  const s = v ? String(v) : "";
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function boolFrom(v: FormDataEntryValue | null | undefined): boolean {
  const s = v ? String(v) : "";
  return s === "on" || s === "true" || s === "1";
}

export function str(v: FormDataEntryValue | null | undefined): string {
  return v ? String(v).trim() : "";
}

export function optStr(v: FormDataEntryValue | null | undefined): string | null {
  const s = str(v);
  return s || null;
}
