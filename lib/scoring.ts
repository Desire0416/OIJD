import {
  OPPORTUNITY_TYPE_META,
  scoreBand,
  type OpportunityType,
} from "@/lib/constants";

/**
 * Moteur de scoring (aide a l'analyse) - cf. cahier des charges section 12.
 *
 * Le score sur 100 combine 5 axes ponderables :
 *   - completude du dossier ............... 25
 *   - correspondance criteres obligatoires  30
 *   - mots-cles / competences attendues ... 20
 *   - experience / references ............. 15
 *   - qualite / coherence des reponses .... 10
 *
 * Chaque appel peut definir ses propres criteres et poids (scoringCriteria).
 * IMPORTANT : ce score n'elimine JAMAIS automatiquement un dossier.
 * La decision finale reste humaine (cf. section 12.6).
 */

export type ScoringCriteria = {
  weights?: Partial<Record<ScoreAxis, number>>;
  keywords?: string[];
  requiredFields?: string[];
  requiredDocuments?: string[];
  minExperienceYears?: number;
};

export type ScoreAxis =
  | "completeness"
  | "requiredMatch"
  | "keywords"
  | "experience"
  | "quality";

export type ScoreInput = {
  type: string;
  scoringCriteria?: ScoringCriteria | null;
  requiredDocuments?: string[];
  formData: Record<string, unknown>;
  documents: { type?: string | null; name?: string | null }[];
};

export type ScoreResult = {
  score: number;
  scoreLabel: string;
  complete: boolean;
  scoreDetails: { axis: ScoreAxis; label: string; weight: number; points: number }[];
  matchedCriteria: string[];
  missingCriteria: string[];
  recommendationSummary: string;
};

const DEFAULT_WEIGHTS: Record<ScoreAxis, number> = {
  completeness: 25,
  requiredMatch: 30,
  keywords: 20,
  experience: 15,
  quality: 10,
};

const AXIS_LABELS: Record<ScoreAxis, string> = {
  completeness: "Completude du dossier",
  requiredMatch: "Criteres obligatoires",
  keywords: "Mots-cles & competences",
  experience: "Experience & references",
  quality: "Qualite des reponses",
};

// Champs de formulaire consideres comme obligatoires par categorie d'appel,
// si l'appel ne definit pas explicitement requiredFields.
const DEFAULT_REQUIRED_FIELDS: Record<string, string[]> = {
  CANDIDACY: ["educationLevel", "experience", "motivation", "skills"],
  PROJECT: ["projectTitle", "summary", "objectives", "budget"],
  TENDER: ["companyName", "references", "technicalOffer", "financialOffer"],
  CONTEST: ["category", "description"],
};

function val(formData: Record<string, unknown>, key: string): string {
  const v = formData[key];
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

function nonEmpty(s: string): boolean {
  return s.trim().length > 0;
}

function allText(formData: Record<string, unknown>): string {
  return Object.values(formData)
    .filter((v) => typeof v === "string")
    .join(" \n ")
    .toLowerCase();
}

export function computeScore(input: ScoreInput): ScoreResult {
  const criteria = input.scoringCriteria ?? {};
  const weights = { ...DEFAULT_WEIGHTS, ...(criteria.weights ?? {}) };
  const meta = OPPORTUNITY_TYPE_META[input.type as OpportunityType];
  const category = meta?.formCategory ?? "CANDIDACY";

  const requiredFields =
    criteria.requiredFields && criteria.requiredFields.length > 0
      ? criteria.requiredFields
      : (DEFAULT_REQUIRED_FIELDS[category] ?? []);

  const requiredDocs =
    criteria.requiredDocuments && criteria.requiredDocuments.length > 0
      ? criteria.requiredDocuments
      : (input.requiredDocuments ?? []);

  const keywords = (criteria.keywords ?? []).map((k) => k.toLowerCase());
  const matched: string[] = [];
  const missing: string[] = [];
  const details: ScoreResult["scoreDetails"] = [];

  // --- 1. Completude : documents fournis + champs d'identite essentiels ----
  const docsProvided = input.documents.length;
  const docsNeeded = Math.max(requiredDocs.length, 0);
  const docRatio = docsNeeded === 0 ? 1 : Math.min(1, docsProvided / docsNeeded);
  if (docsNeeded > 0) {
    if (docsProvided >= docsNeeded)
      matched.push(`Pieces fournies (${docsProvided}/${docsNeeded})`);
    else
      missing.push(
        `Pieces manquantes (${docsProvided}/${docsNeeded} fournies)`,
      );
  } else if (docsProvided > 0) {
    matched.push(`${docsProvided} document(s) joint(s)`);
  }
  const identityFields = ["email"];
  const identityOk = identityFields.every(
    (f) => nonEmpty(val(input.formData, f)) || f === "email",
  );
  const completenessRatio = docRatio * 0.7 + (identityOk ? 0.3 : 0);
  const completenessPts = Math.round(weights.completeness * completenessRatio);
  details.push({
    axis: "completeness",
    label: AXIS_LABELS.completeness,
    weight: weights.completeness,
    points: completenessPts,
  });

  // --- 2. Correspondance criteres obligatoires (champs requis) -------------
  let requiredHit = 0;
  for (const field of requiredFields) {
    if (nonEmpty(val(input.formData, field))) {
      requiredHit += 1;
    } else {
      missing.push(`Champ requis non renseigne : ${humanizeField(field)}`);
    }
  }
  const requiredRatio =
    requiredFields.length === 0 ? 1 : requiredHit / requiredFields.length;
  if (requiredFields.length > 0 && requiredHit > 0) {
    matched.push(
      `Criteres obligatoires : ${requiredHit}/${requiredFields.length} renseignes`,
    );
  }
  const requiredPts = Math.round(weights.requiredMatch * requiredRatio);
  details.push({
    axis: "requiredMatch",
    label: AXIS_LABELS.requiredMatch,
    weight: weights.requiredMatch,
    points: requiredPts,
  });

  // --- 3. Mots-cles / competences -----------------------------------------
  let keywordRatio = 0.6; // neutre si aucun mot-cle attendu
  if (keywords.length > 0) {
    const haystack = allText(input.formData);
    const found = keywords.filter((k) => haystack.includes(k));
    keywordRatio = found.length / keywords.length;
    if (found.length > 0)
      matched.push(`Mots-cles detectes : ${found.slice(0, 6).join(", ")}`);
    const notFound = keywords.filter((k) => !haystack.includes(k));
    if (notFound.length > 0)
      missing.push(`Mots-cles attendus absents : ${notFound.slice(0, 6).join(", ")}`);
  }
  const keywordPts = Math.round(weights.keywords * keywordRatio);
  details.push({
    axis: "keywords",
    label: AXIS_LABELS.keywords,
    weight: weights.keywords,
    points: keywordPts,
  });

  // --- 4. Experience / references -----------------------------------------
  let expRatio = 0;
  const expYears = parseNumber(val(input.formData, "experienceYears"));
  const expText =
    val(input.formData, "experience") || val(input.formData, "references");
  if (criteria.minExperienceYears && expYears !== null) {
    expRatio = Math.min(1, expYears / criteria.minExperienceYears);
  } else if (expYears !== null) {
    expRatio = Math.min(1, expYears / 5);
  } else if (nonEmpty(expText)) {
    expRatio = Math.min(1, expText.length / 280);
  }
  if (expRatio >= 0.5) matched.push("Experience / references significatives");
  else if (expRatio === 0) missing.push("Experience / references peu detaillees");
  const expPts = Math.round(weights.experience * expRatio);
  details.push({
    axis: "experience",
    label: AXIS_LABELS.experience,
    weight: weights.experience,
    points: expPts,
  });

  // --- 5. Qualite / coherence des reponses textuelles ---------------------
  const qualityText = [
    val(input.formData, "motivation"),
    val(input.formData, "summary"),
    val(input.formData, "objectives"),
    val(input.formData, "description"),
    val(input.formData, "message"),
  ]
    .filter(nonEmpty)
    .join(" ");
  const qualityRatio = Math.min(1, qualityText.length / 400);
  if (qualityRatio >= 0.6) matched.push("Reponses redactionnelles detaillees");
  else if (qualityRatio < 0.25)
    missing.push("Reponses redactionnelles trop succinctes");
  const qualityPts = Math.round(weights.quality * qualityRatio);
  details.push({
    axis: "quality",
    label: AXIS_LABELS.quality,
    weight: weights.quality,
    points: qualityPts,
  });

  // --- Total ---------------------------------------------------------------
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawTotal = details.reduce((a, d) => a + d.points, 0);
  const score = Math.max(
    0,
    Math.min(100, Math.round((rawTotal / totalWeight) * 100)),
  );
  const band = scoreBand(score);
  const complete = requiredRatio >= 1 && docRatio >= 1;

  const recommendationSummary = buildSummary(score, band.label, complete, {
    requiredRatio,
    docRatio,
    keywordRatio,
  });

  return {
    score,
    scoreLabel: band.label,
    complete,
    scoreDetails: details,
    matchedCriteria: matched,
    missingCriteria: missing,
    recommendationSummary,
  };
}

function buildSummary(
  score: number,
  label: string,
  complete: boolean,
  r: { requiredRatio: number; docRatio: number; keywordRatio: number },
): string {
  const parts: string[] = [];
  parts.push(`Score de compatibilite : ${score}/100 (${label}).`);
  parts.push(
    complete
      ? "Dossier complet au regard des pieces et champs obligatoires."
      : "Dossier potentiellement incomplet (verifier pieces / champs requis).",
  );
  if (r.keywordRatio >= 0.7)
    parts.push("Bonne adequation avec les competences attendues.");
  parts.push("Decision finale a confirmer par un responsable habilite.");
  return parts.join(" ");
}

function humanizeField(field: string): string {
  const map: Record<string, string> = {
    educationLevel: "niveau d'etude",
    experience: "experience",
    motivation: "motivation",
    skills: "competences",
    projectTitle: "titre du projet",
    summary: "resume",
    objectives: "objectifs",
    budget: "budget",
    companyName: "nom de l'entreprise",
    references: "references",
    technicalOffer: "offre technique",
    financialOffer: "offre financiere",
    category: "categorie",
    description: "description",
  };
  return map[field] ?? field;
}

function parseNumber(s: string): number | null {
  if (!s) return null;
  const m = s.match(/(\d+([.,]\d+)?)/);
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
