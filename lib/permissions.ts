import type { Role } from "@/lib/constants";

/**
 * Capacites (RBAC) centralisees - cf. cahier des charges section 18.
 * "*" = toutes les capacites (super administrateur).
 */
export type Capability =
  | "dashboard.view"
  | "users.manage"
  | "settings.manage"
  | "audit.view"
  | "departments.manage"
  | "news.create"
  | "news.publish"
  | "activities.create"
  | "activities.publish"
  | "content.validate"
  | "opportunities.manage"
  | "submissions.view"
  | "submissions.decide"
  | "documents.manage"
  | "partners.manage"
  | "emails.manage"
  | "contact.manage"
  | "stats.view";

const ALL: Capability[] = [
  "dashboard.view",
  "users.manage",
  "settings.manage",
  "audit.view",
  "departments.manage",
  "news.create",
  "news.publish",
  "activities.create",
  "activities.publish",
  "content.validate",
  "opportunities.manage",
  "submissions.view",
  "submissions.decide",
  "documents.manage",
  "partners.manage",
  "emails.manage",
  "contact.manage",
  "stats.view",
];

export const ROLE_CAPABILITIES: Record<Role, Capability[] | ["*"]> = {
  SUPER_ADMIN: ["*"],
  ADMIN_GENERAL: [
    "dashboard.view",
    "audit.view",
    "departments.manage",
    "news.create",
    "news.publish",
    "activities.create",
    "activities.publish",
    "content.validate",
    "opportunities.manage",
    "submissions.view",
    "submissions.decide",
    "documents.manage",
    "partners.manage",
    "emails.manage",
    "contact.manage",
    "stats.view",
  ],
  PRESIDENT: [
    "dashboard.view",
    "content.validate",
    "submissions.view",
    "submissions.decide",
    "audit.view",
    "stats.view",
  ],
  DEPARTMENT_HEAD: [
    "dashboard.view",
    "news.create",
    "activities.create",
    "submissions.view",
    "submissions.decide",
    "documents.manage",
    "stats.view",
  ],
  COMMUNICATION_MANAGER: [
    "dashboard.view",
    "news.create",
    "news.publish",
    "activities.create",
    "activities.publish",
    "content.validate",
    "documents.manage",
    "partners.manage",
    "stats.view",
  ],
  HR_MANAGER: [
    "dashboard.view",
    "opportunities.manage",
    "submissions.view",
    "submissions.decide",
    "documents.manage",
    "emails.manage",
    "stats.view",
  ],
  CALLS_MANAGER: [
    "dashboard.view",
    "opportunities.manage",
    "submissions.view",
    "submissions.decide",
    "documents.manage",
    "emails.manage",
    "stats.view",
  ],
  EDITOR: ["dashboard.view", "news.create", "activities.create"],
  VALIDATOR: [
    "dashboard.view",
    "content.validate",
    "submissions.view",
    "submissions.decide",
    "stats.view",
  ],
  INTERNAL_READER: ["dashboard.view", "submissions.view", "stats.view"],
  TECH_SUPPORT: ["dashboard.view", "audit.view", "stats.view"],
};

export function can(
  role: string | null | undefined,
  capability: Capability,
): boolean {
  if (!role) return false;
  const caps = ROLE_CAPABILITIES[role as Role];
  if (!caps) return false;
  if (caps[0] === "*") return true;
  return (caps as Capability[]).includes(capability);
}

export function canAny(
  role: string | null | undefined,
  capabilities: Capability[],
): boolean {
  return capabilities.some((c) => can(role, c));
}

/**
 * Les responsables de departement (et lecteurs internes) sont restreints
 * a leur propre perimetre pour les dossiers et contenus.
 */
export function isDepartmentScoped(role: string | null | undefined): boolean {
  return role === "DEPARTMENT_HEAD" || role === "INTERNAL_READER";
}

export function allCapabilities(): Capability[] {
  return ALL;
}
