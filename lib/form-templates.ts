import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import type { FormSchema } from "@/lib/submission-types";
import type { ScoringCriteria } from "@/lib/scoring";

/**
 * Modeles de formulaires dynamiques par categorie d'appel.
 * Utilises pour generer automatiquement le formulaire de soumission et la
 * grille de scoring lors de la creation d'un appel dans le dashboard.
 */
export const CANDIDACY_FORM: FormSchema = {
  fields: [
    {
      name: "educationLevel",
      label: "Niveau d'etude",
      type: "select",
      required: true,
      options: ["Baccalaureat", "Licence", "Master", "Doctorat", "Autre"],
    },
    { name: "trainingField", label: "Domaine de formation", type: "text" },
    { name: "experience", label: "Experience", type: "textarea", required: true },
    { name: "experienceYears", label: "Annees d'experience", type: "number" },
    { name: "skills", label: "Competences principales", type: "textarea", required: true },
    { name: "availability", label: "Disponibilite", type: "text" },
    { name: "interestDomain", label: "Domaine d'interet", type: "text" },
    { name: "motivation", label: "Motivation", type: "textarea", required: true },
  ],
};

export const PROJECT_FORM: FormSchema = {
  fields: [
    { name: "projectTitle", label: "Titre du projet", type: "text", required: true },
    { name: "domain", label: "Domaine", type: "text" },
    { name: "summary", label: "Resume du projet", type: "textarea", required: true },
    { name: "objectives", label: "Objectifs", type: "textarea", required: true },
    { name: "targetAudience", label: "Public cible", type: "text" },
    { name: "expectedResults", label: "Resultats attendus", type: "textarea" },
    { name: "duration", label: "Duree", type: "text" },
    { name: "interventionZone", label: "Zone d'intervention", type: "text" },
    { name: "budget", label: "Budget previsionnel (FCFA)", type: "text", required: true },
  ],
};

export const TENDER_FORM: FormSchema = {
  fields: [
    { name: "companyName", label: "Nom de l'entreprise / prestataire", type: "text", required: true },
    { name: "legalRep", label: "Representant legal", type: "text" },
    { name: "activityDomain", label: "Domaine d'activite", type: "text" },
    { name: "references", label: "References", type: "textarea", required: true },
    { name: "relevantExperience", label: "Experiences pertinentes", type: "textarea" },
    { name: "technicalOffer", label: "Offre technique", type: "textarea", required: true },
    { name: "financialOffer", label: "Offre financiere (FCFA)", type: "text", required: true },
  ],
};

export const CONTEST_FORM: FormSchema = {
  fields: [
    { name: "category", label: "Categorie de participation", type: "text", required: true },
    { name: "description", label: "Description de l'initiative", type: "textarea", required: true },
    { name: "links", label: "Liens de presentation (video, site...)", type: "text" },
  ],
};

const BY_CATEGORY: Record<string, FormSchema> = {
  CANDIDACY: CANDIDACY_FORM,
  PROJECT: PROJECT_FORM,
  TENDER: TENDER_FORM,
  CONTEST: CONTEST_FORM,
};

const REQUIRED_FIELDS: Record<string, string[]> = {
  CANDIDACY: ["educationLevel", "experience", "motivation", "skills"],
  PROJECT: ["projectTitle", "summary", "objectives", "budget"],
  TENDER: ["companyName", "references", "technicalOffer", "financialOffer"],
  CONTEST: ["category", "description"],
};

export function defaultFormSchema(type: string): FormSchema {
  const cat = OPPORTUNITY_TYPE_META[type as OpportunityType]?.formCategory ?? "CANDIDACY";
  return BY_CATEGORY[cat] ?? CANDIDACY_FORM;
}

export function defaultScoring(type: string, keywords: string[]): ScoringCriteria {
  const cat = OPPORTUNITY_TYPE_META[type as OpportunityType]?.formCategory ?? "CANDIDACY";
  return {
    keywords,
    requiredFields: REQUIRED_FIELDS[cat] ?? [],
  };
}
