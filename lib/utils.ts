import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusion de classes Tailwind sans conflit. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Genere un slug propre a partir d'un texte (sans accents). */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const FR_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const FR_DATE_SHORT = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const FR_DATETIME = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date?: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";
  return FR_DATE.format(d);
}

export function formatDateShort(date?: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";
  return FR_DATE_SHORT.format(d);
}

export function formatDateTime(date?: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";
  return FR_DATETIME.format(d);
}

/** Nombre de jours restants jusqu'a une echeance (peut etre negatif). */
export function daysUntil(date?: Date | string | null): number | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDeadline(date?: Date | string | null): string {
  const days = daysUntil(date);
  if (days === null) return "Sans echeance";
  if (days < 0) return "Cloture";
  if (days === 0) return "Dernier jour";
  if (days === 1) return "1 jour restant";
  if (days <= 30) return `${days} jours restants`;
  return `Echeance : ${formatDate(date)}`;
}

/** Initiales d'un nom (pour avatars). */
export function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

/** Reference publique d'un dossier, ex: OIJD-2026-7F3A9C. */
export function generateReference(): string {
  const year = new Date().getFullYear();
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `OIJD-${year}-${code}`;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count > 1 ? (plural ?? `${singular}s`) : singular;
}
