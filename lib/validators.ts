import { z } from "zod";
import {
  ACTIVITY_STATUS,
  DOCUMENT_VISIBILITY,
  OPPORTUNITY_STATUS,
  OPPORTUNITY_TYPES,
  PUBLISH_STATUS,
  ROLES,
  USER_STATUS,
} from "@/lib/constants";

const nonEmpty = (label: string) =>
  z.string({ required_error: `${label} est requis.` }).trim().min(1, `${label} est requis.`);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email invalide."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caracteres."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirm"],
  });

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  name: nonEmpty("Le nom"),
  email: z.string().trim().email("Email invalide."),
  phone: z.string().trim().optional(),
  subject: nonEmpty("L'objet"),
  message: nonEmpty("Le message").pipe(z.string().min(10, "Message trop court.")),
  departmentId: z.string().optional(),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0, "Spam detecte.").optional().or(z.literal("")),
});

// ---------------------------------------------------------------------------
// Soumission de dossier (champs communs ; les champs dynamiques sont dans formData)
// ---------------------------------------------------------------------------

export const submissionSchema = z.object({
  submitterType: z.enum(["INDIVIDUAL", "ORGANIZATION"]).default("INDIVIDUAL"),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  organizationName: z.string().trim().optional(),
  email: z.string().trim().email("Email invalide."),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  city: z.string().trim().optional(),
  title: z.string().trim().optional(),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "Vous devez accepter le traitement de vos donnees.",
    }),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

// ---------------------------------------------------------------------------
// Dashboard : contenus & entites
// ---------------------------------------------------------------------------

export const newsSchema = z.object({
  title: nonEmpty("Le titre"),
  excerpt: z.string().trim().optional(),
  content: nonEmpty("Le contenu"),
  category: z.string().trim().optional(),
  keywords: z.string().trim().optional(), // virgules
  coverImage: z.string().trim().optional(),
  status: z.enum(PUBLISH_STATUS),
  featured: z.coerce.boolean().optional(),
  departmentId: z.string().optional(),
});

export const activitySchema = z.object({
  title: nonEmpty("Le titre"),
  excerpt: z.string().trim().optional(),
  description: nonEmpty("La description"),
  location: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  objectives: z.string().trim().optional(),
  results: z.string().trim().optional(),
  status: z.enum(ACTIVITY_STATUS),
  coverImage: z.string().trim().optional(),
  partners: z.string().trim().optional(), // virgules
  featured: z.coerce.boolean().optional(),
  departmentId: z.string().optional(),
});

export const departmentSchema = z.object({
  name: nonEmpty("Le nom"),
  icon: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  mission: z.string().trim().optional(),
  responsibilities: z.string().trim().optional(), // une par ligne
  publicEmail: z.string().trim().email("Email invalide.").optional().or(z.literal("")),
  headId: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const partnerSchema = z.object({
  name: nonEmpty("Le nom"),
  description: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  websiteUrl: z.string().trim().url("URL invalide.").optional().or(z.literal("")),
  partnershipType: z.string().trim().optional(),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const userSchema = z.object({
  name: nonEmpty("Le nom"),
  email: z.string().trim().email("Email invalide."),
  role: z.enum(ROLES),
  status: z.enum(USER_STATUS),
  departmentId: z.string().optional(),
  title: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  password: z
    .string()
    .min(8, "Au moins 8 caracteres.")
    .optional()
    .or(z.literal("")),
});

export const opportunitySchema = z.object({
  title: nonEmpty("Le titre"),
  type: z.enum(OPPORTUNITY_TYPES),
  status: z.enum(OPPORTUNITY_STATUS),
  summary: z.string().trim().optional(),
  context: z.string().trim().optional(),
  objectives: z.string().trim().optional(),
  targetAudience: z.string().trim().optional(),
  eligibility: z.string().trim().optional(),
  selectionCriteria: z.string().trim().optional(),
  requiredDocuments: z.string().trim().optional(), // une par ligne
  openingDate: z.string().trim().optional(),
  deadline: z.string().trim().optional(),
  processCalendar: z.string().trim().optional(),
  submissionGuidelines: z.string().trim().optional(),
  contactInfo: z.string().trim().optional(),
  country: z.string().trim().optional(),
  city: z.string().trim().optional(),
  domain: z.string().trim().optional(),
  educationLevel: z.string().trim().optional(),
  featured: z.coerce.boolean().optional(),
  departmentId: z.string().optional(),
  keywords: z.string().trim().optional(), // pour scoring (virgules)
});

export const emailTemplateSchema = z.object({
  subject: nonEmpty("L'objet"),
  bodyHtml: nonEmpty("Le contenu"),
  isActive: z.coerce.boolean().optional(),
});

export const internalNoteSchema = z.object({
  content: nonEmpty("La note").pipe(z.string().min(2)),
});

export const decisionSchema = z.object({
  status: z.string().min(1),
  comment: z.string().trim().optional(),
  sendEmail: z.coerce.boolean().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
