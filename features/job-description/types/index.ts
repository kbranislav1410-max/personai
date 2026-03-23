// ── Predefined options ────────────────────────────────────────────────────────

export const POSITION_TEMPLATES = [
  "Software Developer / Vývojár",
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps / Cloud Engineer",
  "Data Scientist / ML Engineer",
  "Data Analyst / Analytik dát",
  "QA Engineer / Tester",
  "UX/UI Designer",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Scrum Master / Agile Coach",
  "Team Leader / Tech Lead",
  "Marketing Specialist",
  "Content Manager / Copywriter",
  "Sales Representative / Obchodný zástupca",
  "Account Manager",
  "HR Specialist / Personalista",
  "Recruiter",
  "Accountant / Účtovník",
  "Financial Controller",
  "Legal Counsel / Právnik",
  "Operations Manager",
  "Customer Support / Zákaznícka podpora",
  "Vlastná pozícia...",
] as const;

export type PositionTemplate = (typeof POSITION_TEMPLATES)[number];

export const SENIORITY_OPTIONS = [
  "Stážista / Praktikant",
  "Junior",
  "Mid-level",
  "Senior",
  "Lead",
  "Principal / Staff",
  "Manager",
  "Director",
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  "Plný úväzok",
  "Čiastočný úväzok",
  "Kontrakt / IČO",
  "Freelance",
  "Dohoda (DPP / DPC)",
  "Praktikantstvo / Stáž",
] as const;

export const LANGUAGE_OPTIONS = [
  "Slovenčina",
  "Angličtina",
  "Nemčina",
  "Čeština",
  "Francúzština",
  "Španielčina",
  "Taliančina",
  "Poľština",
  "Maďarčina",
  "Ruština",
  "Čínština",
  "Japončina",
  "Iný jazyk",
] as const;

export const LANGUAGE_LEVEL_OPTIONS = [
  "A1 – Začiatočník",
  "A2 – Základná",
  "B1 – Stredná",
  "B2 – Vyššia stredná",
  "C1 – Pokročilá",
  "C2 – Rodilý hovorec / Materinský",
] as const;

export const DRIVER_LICENSE_OPTIONS = [
  "Nie je požiadavka",
  "Skupina A",
  "Skupina B",
  "Skupina C",
  "Skupina D",
  "Skupina B + E",
  "Skupina C + E",
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  "Základná škola",
  "Stredná škola (bez maturity)",
  "Stredná škola s maturitou",
  "Vysokoškolské I. stupeň (Bc.)",
  "Vysokoškolské II. stupeň (Mgr. / Ing.)",
  "Doktorát (PhD.)",
] as const;

export const EDUCATION_FIELD_OPTIONS = [
  "Informatika / IT",
  "Elektrotechnika",
  "Strojárstvo",
  "Ekonomika a manažment",
  "Marketing a obchod",
  "Právo",
  "Medicína a zdravotníctvo",
  "Pedagogika",
  "Architektúra a stavebníctvo",
  "Prírodné vedy",
  "Spoločenské vedy",
  "Umenie a dizajn",
  "Iné",
] as const;

// ── Composite sub-types ───────────────────────────────────────────────────────

export interface LanguageSkill {
  language: string;
  level: string;
}

// ── Main form data ────────────────────────────────────────────────────────────

export interface JobDescriptionFormData {
  // Section 1 – Position basics
  positionTemplate: string;   // predefined or "Vlastná pozícia..."
  positionCustom: string;     // used when positionTemplate === "Vlastná pozícia..."
  jobContent: string;         // náplň práce
  seniority: string;          // dropdown
  teamSize: string;
  teamType: string;
  teamAverageAge: string;
  positionGoal: string;       // cieľ na 3-6 mesiacov
  whyApply: string;           // prečo by mal chcieť uchádzač túto pozíciu

  // Section 2 – Requirements
  mustHave: string;
  niceToHave: string;

  // Section 3 – Conditions
  location: string;
  employmentType: string;
  salary: string;

  // Section 4 – Additional requirements
  languageSkills: LanguageSkill[];
  driverLicense: string;
  certificates: string[];     // list added via +
  educationRequired: boolean;
  educationLevel: string;
  educationFields: string[];  // multi-select via + dropdown

  // Output language
  language: "SK" | "EN";

  // Auto-filled from company profile
  benefits: string;
  companyInfo: string;
  toneOfVoice?: string;
  toneOfVoiceCustom?: string;

  // Legacy – kept for backward compat with prompt builder serialisation
  /** @deprecated use positionTemplate + positionCustom + jobContent */
  roleDescription: string;
}

export interface JobDescriptionResult {
  content: string;
}
