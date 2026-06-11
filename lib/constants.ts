/**
 * Valeurs "enum" centralisees (SQLite ne supporte pas les enums natifs).
 * Chaque ensemble fournit : les cles autorisees, les libelles FR, et un "tone"
 * pour la coloration des badges (voir components/ui/badge.tsx).
 */

export type Tone =
  | "green"
  | "orange"
  | "flame"
  | "blue"
  | "gray"
  | "red"
  | "amber"
  | "purple"
  | "teal";

// ---------------------------------------------------------------------------
// Roles & permissions
// ---------------------------------------------------------------------------

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN_GENERAL",
  "PRESIDENT",
  "DEPARTMENT_HEAD",
  "COMMUNICATION_MANAGER",
  "HR_MANAGER",
  "CALLS_MANAGER",
  "EDITOR",
  "VALIDATOR",
  "INTERNAL_READER",
  "TECH_SUPPORT",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_META: Record<Role, { label: string; tone: Tone }> = {
  SUPER_ADMIN: { label: "Super administrateur", tone: "purple" },
  ADMIN_GENERAL: { label: "Administrateur general", tone: "green" },
  PRESIDENT: { label: "Presidence / Direction", tone: "flame" },
  DEPARTMENT_HEAD: { label: "Responsable de departement", tone: "teal" },
  COMMUNICATION_MANAGER: { label: "Responsable communication", tone: "orange" },
  HR_MANAGER: { label: "Responsable RH", tone: "blue" },
  CALLS_MANAGER: { label: "Responsable des appels", tone: "amber" },
  EDITOR: { label: "Redacteur", tone: "gray" },
  VALIDATOR: { label: "Validateur", tone: "green" },
  INTERNAL_READER: { label: "Lecteur interne", tone: "gray" },
  TECH_SUPPORT: { label: "Support technique", tone: "purple" },
};

export const USER_STATUS = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUS)[number];
export const USER_STATUS_META: Record<UserStatus, { label: string; tone: Tone }> =
  {
    ACTIVE: { label: "Actif", tone: "green" },
    INACTIVE: { label: "Inactif", tone: "gray" },
    SUSPENDED: { label: "Suspendu", tone: "red" },
  };

// ---------------------------------------------------------------------------
// Publication (actualites)
// ---------------------------------------------------------------------------

export const PUBLISH_STATUS = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
  "REJECTED",
] as const;
export type PublishStatus = (typeof PUBLISH_STATUS)[number];
export const PUBLISH_STATUS_META: Record<
  PublishStatus,
  { label: string; tone: Tone }
> = {
  DRAFT: { label: "Brouillon", tone: "gray" },
  PENDING_REVIEW: { label: "En attente de validation", tone: "amber" },
  PUBLISHED: { label: "Publie", tone: "green" },
  ARCHIVED: { label: "Archive", tone: "gray" },
  REJECTED: { label: "Rejete", tone: "red" },
};

// ---------------------------------------------------------------------------
// Activites
// ---------------------------------------------------------------------------

export const ACTIVITY_STATUS = [
  "PLANNED",
  "ONGOING",
  "COMPLETED",
  "POSTPONED",
  "CANCELLED",
  "ARCHIVED",
] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUS)[number];
export const ACTIVITY_STATUS_META: Record<
  ActivityStatus,
  { label: string; tone: Tone }
> = {
  PLANNED: { label: "Prevue", tone: "blue" },
  ONGOING: { label: "En cours", tone: "orange" },
  COMPLETED: { label: "Realisee", tone: "green" },
  POSTPONED: { label: "Reportee", tone: "amber" },
  CANCELLED: { label: "Annulee", tone: "red" },
  ARCHIVED: { label: "Archivee", tone: "gray" },
};

// ---------------------------------------------------------------------------
// Appels & opportunites
// ---------------------------------------------------------------------------

export type FormCategory = "CANDIDACY" | "PROJECT" | "TENDER" | "CONTEST";

export const OPPORTUNITY_TYPES = [
  "PROJECT_CALL",
  "CANDIDACY_CALL",
  "TENDER",
  "EXPRESSION_OF_INTEREST",
  "PARTICIPATION_CALL",
  "CONTEST",
  "AWARD",
  "RECRUITMENT",
  "INTERNSHIP",
  "VOLUNTEERING",
  "MISSION",
  "TRAINING",
  "YOUTH_PROGRAM",
  "LEADERSHIP_PROGRAM",
  "PARTNERSHIP",
  "EXPERT_CALL",
  "CONSULTANT_CALL",
  "PROVIDER_CALL",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const OPPORTUNITY_TYPE_META: Record<
  OpportunityType,
  {
    label: string;
    group: string;
    icon: string;
    formCategory: FormCategory;
    actionLabel: string;
    tone: Tone;
  }
> = {
  PROJECT_CALL: {
    label: "Appel a projets",
    group: "Projets",
    icon: "FolderKanban",
    formCategory: "PROJECT",
    actionLabel: "Soumettre un projet",
    tone: "green",
  },
  CANDIDACY_CALL: {
    label: "Appel a candidatures",
    group: "Candidatures",
    icon: "UserPlus",
    formCategory: "CANDIDACY",
    actionLabel: "Postuler",
    tone: "orange",
  },
  TENDER: {
    label: "Appel d'offres",
    group: "Offres & prestations",
    icon: "FileText",
    formCategory: "TENDER",
    actionLabel: "Deposer une offre",
    tone: "blue",
  },
  EXPRESSION_OF_INTEREST: {
    label: "Manifestation d'interet",
    group: "Projets",
    icon: "Lightbulb",
    formCategory: "PROJECT",
    actionLabel: "Manifester son interet",
    tone: "teal",
  },
  PARTICIPATION_CALL: {
    label: "Appel a participation",
    group: "Candidatures",
    icon: "CalendarCheck",
    formCategory: "CANDIDACY",
    actionLabel: "Participer",
    tone: "orange",
  },
  CONTEST: {
    label: "Concours",
    group: "Concours & prix",
    icon: "Trophy",
    formCategory: "CONTEST",
    actionLabel: "Participer",
    tone: "amber",
  },
  AWARD: {
    label: "Prix & distinction",
    group: "Concours & prix",
    icon: "Award",
    formCategory: "CONTEST",
    actionLabel: "Candidater",
    tone: "amber",
  },
  RECRUITMENT: {
    label: "Recrutement",
    group: "Emploi & stages",
    icon: "Briefcase",
    formCategory: "CANDIDACY",
    actionLabel: "Postuler",
    tone: "blue",
  },
  INTERNSHIP: {
    label: "Stage",
    group: "Emploi & stages",
    icon: "GraduationCap",
    formCategory: "CANDIDACY",
    actionLabel: "Postuler",
    tone: "teal",
  },
  VOLUNTEERING: {
    label: "Volontariat",
    group: "Emploi & stages",
    icon: "HeartHandshake",
    formCategory: "CANDIDACY",
    actionLabel: "M'engager",
    tone: "green",
  },
  MISSION: {
    label: "Mission ponctuelle",
    group: "Emploi & stages",
    icon: "MapPin",
    formCategory: "CANDIDACY",
    actionLabel: "Postuler",
    tone: "blue",
  },
  TRAINING: {
    label: "Programme de formation",
    group: "Programmes & formations",
    icon: "BookOpen",
    formCategory: "CANDIDACY",
    actionLabel: "S'inscrire",
    tone: "green",
  },
  YOUTH_PROGRAM: {
    label: "Programme jeunesse",
    group: "Programmes & formations",
    icon: "Sparkles",
    formCategory: "CANDIDACY",
    actionLabel: "Rejoindre",
    tone: "orange",
  },
  LEADERSHIP_PROGRAM: {
    label: "Programme de leadership",
    group: "Programmes & formations",
    icon: "Star",
    formCategory: "CANDIDACY",
    actionLabel: "Candidater",
    tone: "flame",
  },
  PARTNERSHIP: {
    label: "Opportunite de partenariat",
    group: "Projets",
    icon: "Handshake",
    formCategory: "PROJECT",
    actionLabel: "Proposer un partenariat",
    tone: "teal",
  },
  EXPERT_CALL: {
    label: "Appel a experts",
    group: "Offres & prestations",
    icon: "BadgeCheck",
    formCategory: "CANDIDACY",
    actionLabel: "Proposer mon expertise",
    tone: "purple",
  },
  CONSULTANT_CALL: {
    label: "Appel a consultants",
    group: "Offres & prestations",
    icon: "Briefcase",
    formCategory: "TENDER",
    actionLabel: "Deposer une offre",
    tone: "purple",
  },
  PROVIDER_CALL: {
    label: "Appel a prestataires",
    group: "Offres & prestations",
    icon: "Truck",
    formCategory: "TENDER",
    actionLabel: "Deposer une offre",
    tone: "blue",
  },
};

export const OPPORTUNITY_GROUPS = [
  "Projets",
  "Candidatures",
  "Emploi & stages",
  "Offres & prestations",
  "Concours & prix",
  "Programmes & formations",
] as const;

export const OPPORTUNITY_STATUS = [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "CLOSED",
  "UNDER_REVIEW",
  "RESULTS_PUBLISHED",
  "SUSPENDED",
  "ARCHIVED",
] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUS)[number];
export const OPPORTUNITY_STATUS_META: Record<
  OpportunityStatus,
  { label: string; tone: Tone; public: boolean }
> = {
  DRAFT: { label: "Brouillon", tone: "gray", public: false },
  SCHEDULED: { label: "Bientot ouvert", tone: "blue", public: true },
  PUBLISHED: { label: "Ouvert", tone: "green", public: true },
  CLOSED: { label: "Cloture", tone: "red", public: true },
  UNDER_REVIEW: { label: "En cours d'analyse", tone: "amber", public: true },
  RESULTS_PUBLISHED: { label: "Resultats publies", tone: "purple", public: true },
  SUSPENDED: { label: "Suspendu", tone: "orange", public: true },
  ARCHIVED: { label: "Archive", tone: "gray", public: true },
};

// ---------------------------------------------------------------------------
// Dossiers (soumissions)
// ---------------------------------------------------------------------------

export const SUBMISSION_STATUS = [
  "RECEIVED",
  "PENDING_VERIFICATION",
  "INCOMPLETE",
  "COMPLEMENT_REQUESTED",
  "UNDER_REVIEW",
  "RECOMMENDED",
  "PRESELECTED",
  "INTERVIEW",
  "RETAINED",
  "REJECTED",
  "FINAL_VALIDATED",
  "ARCHIVED",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUS)[number];
export const SUBMISSION_STATUS_META: Record<
  SubmissionStatus,
  { label: string; tone: Tone }
> = {
  RECEIVED: { label: "Recu", tone: "blue" },
  PENDING_VERIFICATION: { label: "A verifier", tone: "amber" },
  INCOMPLETE: { label: "Incomplet", tone: "red" },
  COMPLEMENT_REQUESTED: { label: "Complement demande", tone: "orange" },
  UNDER_REVIEW: { label: "En analyse", tone: "amber" },
  RECOMMENDED: { label: "Recommande", tone: "teal" },
  PRESELECTED: { label: "Preselectionne", tone: "purple" },
  INTERVIEW: { label: "Entretien", tone: "blue" },
  RETAINED: { label: "Retenu", tone: "green" },
  REJECTED: { label: "Non retenu", tone: "red" },
  FINAL_VALIDATED: { label: "Selection finale", tone: "green" },
  ARCHIVED: { label: "Archive", tone: "gray" },
};

// Transitions de statut proposees dans la fiche d'analyse.
export const SUBMISSION_ACTIONS: {
  status: SubmissionStatus;
  label: string;
  emailTemplate?: string;
}[] = [
  { status: "UNDER_REVIEW", label: "Mettre en analyse" },
  {
    status: "COMPLEMENT_REQUESTED",
    label: "Demander un complement",
    emailTemplate: "complement_requested",
  },
  {
    status: "INCOMPLETE",
    label: "Marquer incomplet",
    emailTemplate: "incomplete",
  },
  { status: "PRESELECTED", label: "Preselectionner", emailTemplate: "preselected" },
  { status: "INTERVIEW", label: "Inviter a un entretien", emailTemplate: "interview" },
  { status: "RETAINED", label: "Retenir" },
  { status: "REJECTED", label: "Ne pas retenir", emailTemplate: "rejected" },
  {
    status: "FINAL_VALIDATED",
    label: "Validation finale",
    emailTemplate: "final_selection",
  },
  { status: "ARCHIVED", label: "Archiver" },
];

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const DOCUMENT_VISIBILITY = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "PRIVATE",
] as const;
export type DocumentVisibility = (typeof DOCUMENT_VISIBILITY)[number];
export const DOCUMENT_VISIBILITY_META: Record<
  DocumentVisibility,
  { label: string; tone: Tone }
> = {
  PUBLIC: { label: "Public", tone: "green" },
  INTERNAL: { label: "Interne", tone: "blue" },
  CONFIDENTIAL: { label: "Confidentiel", tone: "amber" },
  PRIVATE: { label: "Prive", tone: "red" },
};

export const ALLOWED_UPLOAD_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
};

// ---------------------------------------------------------------------------
// Score de compatibilite
// ---------------------------------------------------------------------------

export const SCORE_BANDS: {
  min: number;
  label: string;
  tone: Tone;
  description: string;
}[] = [
  {
    min: 90,
    label: "Tres pertinent",
    tone: "green",
    description: "Dossier tres pertinent ou profil tres compatible.",
  },
  {
    min: 75,
    label: "Fortement interessant",
    tone: "teal",
    description: "Dossier fortement interessant a examiner rapidement.",
  },
  {
    min: 60,
    label: "A examiner",
    tone: "blue",
    description: "Dossier a examiner avec attention.",
  },
  {
    min: 40,
    label: "Partiellement compatible",
    tone: "amber",
    description: "Dossier partiellement compatible.",
  },
  {
    min: 0,
    label: "Faiblement compatible",
    tone: "red",
    description:
      "Dossier faiblement compatible, a verifier manuellement si necessaire.",
  },
];

export function scoreBand(score: number) {
  return SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

// ---------------------------------------------------------------------------
// Helpers generiques
// ---------------------------------------------------------------------------

export function labelOf<T extends string>(
  meta: Record<string, { label: string }>,
  key: T | null | undefined,
  fallback = "-",
): string {
  if (!key) return fallback;
  return meta[key]?.label ?? key;
}
