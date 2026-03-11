interface BuildJobDescriptionPromptInput {
  description: string;
  seniority?: string;
  location?: string;
  employmentType?: string;
  benefits?: string;
  companyInfo?: string;
  salary?: string;
  languageSkills?: string;
  driverLicense?: string;
  certificates?: string;
  education?: string;
  language: "SK" | "EN";
}

/**
 * Builds a structured AI prompt that instructs the model to generate a
 * complete, professional job description based on the provided inputs.
 */
export function buildJobDescriptionPrompt(
  input: BuildJobDescriptionPromptInput
): string {
  const {
    description,
    seniority,
    location,
    employmentType,
    benefits,
    companyInfo,
    salary,
    languageSkills,
    driverLicense,
    certificates,
    education,
    language,
  } = input;

  const contextLines: string[] = [`Role description: ${description}`];
  if (seniority) contextLines.push(`Seniority level: ${seniority}`);
  if (location) contextLines.push(`Location: ${location}`);
  if (employmentType) contextLines.push(`Employment type: ${employmentType}`);
  if (education) contextLines.push(`Required education: ${education}`);
  if (companyInfo) contextLines.push(`Company information: ${companyInfo}`);
  if (salary) contextLines.push(`Salary and compensation: ${salary}`);
  if (benefits) contextLines.push(`Benefits offered: ${benefits}`);
  if (languageSkills) contextLines.push(`Required language skills: ${languageSkills}`);
  if (driverLicense) contextLines.push(`Driver's license: ${driverLicense}`);
  if (certificates) contextLines.push(`Required certificates/trainings: ${certificates}`);

  const context = contextLines.join("\n");

  const outputLanguageInstruction =
    language === "SK"
      ? "Write the entire job description in Slovak (slovenčina)."
      : "Write the entire job description in English.";

  return `You are an expert HR copywriter who creates professional, inclusive, and compelling job descriptions.

${outputLanguageInstruction}

Use the following role details as input:
${context}

Generate a complete job description that includes ALL of the sections below. Follow the structure exactly.

---

## Job Title
Provide 2–3 alternative job title options that accurately reflect the role and seniority level.

## Summary
Write a 2–4 sentence overview of the role. Describe what the person will do, the impact they will have, and who they will work with. Keep the tone engaging and professional.

## About the Company
Write 2–3 sentences introducing the company. Use the provided company information if available, otherwise write a brief placeholder.

## Responsibilities
List 6–10 bullet points describing the key day-to-day responsibilities and ownership areas of this role. Start each point with an action verb (e.g. "Lead", "Design", "Collaborate").

## Requirements (Must-have)
List 6–10 bullet points covering the essential skills, experience, and qualifications required for this role. Include required education, language skills, driver's license, and any specified certificates or trainings if provided in the input.

## Nice-to-have
List 3–6 bullet points covering additional skills or experience that would be advantageous but are not mandatory.

## Benefits
List the benefits and perks offered to the successful candidate. Use the provided benefits if available, otherwise suggest appropriate ones. If salary and compensation information is provided, include it here.

## Hiring Process
Describe the hiring process in 3–5 clear steps (e.g. application review, interview stages, offer). Help candidates understand what to expect.

## Equal Opportunity Statement
Write a concise equal opportunity and inclusion statement affirming that the company welcomes candidates of all backgrounds regardless of age, gender, ethnicity, religion, disability, sexual orientation, or any other characteristic protected by law.

---

Guidelines:
- Tone: professional, warm, non-discriminatory, and clear.
- Avoid gendered language (use "they/them" when referring to the candidate).
- Keep bullet points concise (one idea per point).
- Do not add any sections beyond those listed above.`;
}
