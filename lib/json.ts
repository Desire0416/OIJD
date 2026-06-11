/**
 * Helpers de (de)serialisation JSON.
 * SQLite ne supportant pas les listes scalaires ni le type Json natif,
 * ces champs sont stockes en String encodee JSON.
 */

export function toJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "null";
  }
}

export function parseArray<T = string>(value?: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function parseObject<T = Record<string, unknown>>(
  value: string | null | undefined,
  fallback: T,
): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return parsed as T;
    return fallback;
  } catch {
    return fallback;
  }
}
