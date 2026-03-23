interface BuildJobDescriptionPromptInput {
  description: string; // position + jobContent (backward compat)
  language: "SK" | "EN";

  // Section 1
  positionTemplate?: string;
  positionCustom?: string;
  jobContent?: string;
  seniority?: string;
  teamSize?: string;
  teamType?: string;
  teamAverageAge?: string;
  positionGoal?: string;
  whyApply?: string;

  // Section 2
  mustHave?: string;
  niceToHave?: string;

  // Section 3
  location?: string;
  employmentType?: string;
  salary?: string;

  // Section 4
  languageSkillsSerialized?: string;
  driverLicense?: string;
  certificates?: string;
  educationRequired?: boolean;
  educationLevel?: string;
  educationFields?: string;

  // Company profile
  benefits?: string;
  companyInfo?: string;
  toneOfVoice?: string;
  toneOfVoiceCustom?: string;
}

export function buildJobDescriptionPrompt(
  input: BuildJobDescriptionPromptInput
): string {
  const {
    description,
    language,
    positionTemplate,
    positionCustom,
    jobContent,
    seniority,
    teamSize,
    teamType,
    teamAverageAge,
    positionGoal,
    whyApply,
    mustHave,
    niceToHave,
    location,
    employmentType,
    salary,
    languageSkillsSerialized,
    driverLicense,
    certificates,
    educationRequired,
    educationLevel,
    educationFields,
    benefits,
    companyInfo,
    toneOfVoice,
    toneOfVoiceCustom,
  } = input;

  const positionName =
    positionTemplate === "Vlastná pozícia..."
      ? positionCustom ?? description
      : positionTemplate ?? description;

  const contextLines: string[] = [];

  if (positionName) contextLines.push(`Position: ${positionName}`);
  if (jobContent) contextLines.push(`Job content / what the employee will do: ${jobContent}`);
  if (seniority) contextLines.push(`Seniority level: ${seniority}`);

  const teamParts = [
    teamSize && `size: ${teamSize}`,
    teamType && `type: ${teamType}`,
    teamAverageAge && `average age: ${teamAverageAge}`,
  ].filter(Boolean);
  if (teamParts.length) contextLines.push(`Team – ${teamParts.join(", ")}`);

  if (positionGoal) contextLines.push(`Position goal (next 3-6 months): ${positionGoal}`);
  if (whyApply) contextLines.push(`Why a candidate should want this position: ${whyApply}`);

  if (mustHave) contextLines.push(`Must-have requirements:\n${mustHave}`);
  if (niceToHave) contextLines.push(`Nice-to-have requirements:\n${niceToHave}`);

  if (location) contextLines.push(`Location: ${location}`);
  if (employmentType) contextLines.push(`Employment type: ${employmentType}`);
  if (salary) contextLines.push(`Salary and compensation: ${salary}`);
  if (companyInfo) contextLines.push(`Company information: ${companyInfo}`);
  if (benefits) contextLines.push(`Benefits offered: ${benefits}`);
  if (languageSkillsSerialized) contextLines.push(`Required language skills: ${languageSkillsSerialized}`);
  if (driverLicense && driverLicense !== "Nie je požiadavka") contextLines.push(`Driver's license: ${driverLicense}`);
  if (certificates) contextLines.push(`Required certificates/trainings: ${certificates}`);
  if (educationRequired && educationLevel) {
    const eduLine = [`Education: ${educationLevel}`, educationFields && `field(s): ${educationFields}`]
      .filter(Boolean)
      .join(", ");
    contextLines.push(eduLine);
  }

  // Fallback: if no structured data, fall back to legacy description string
  if (contextLines.length === 0) {
    contextLines.push(`Role description: ${description}`);
  }

  const context = contextLines.join("\n\n");

  const toneLines: string[] = [];
  if (toneOfVoice) toneLines.push(`Tone of voice style: ${toneOfVoice}`);
  if (toneOfVoiceCustom) toneLines.push(`Additional tone guidance: ${toneOfVoiceCustom}`);
  const toneInstruction =
    toneLines.length > 0
      ? `\nCommunication style:\n${toneLines.join("\n")}\nApply this tone consistently throughout the entire job description.\n`
      : "";

  const outputLanguageInstruction =
    language === "SK"
      ? "Write the entire job description in Slovak (slovenčina)."
      : "Write the entire job description in English.";

  return `You are an expert HR copywriter who creates professional, inclusive, and compelling job descriptions.

${outputLanguageInstruction}
${toneInstruction}
Use the following role details as input:
${context}

Generate a complete job description that includes ALL of the sections below. Follow the structure exactly.

---

## Job Title
Provide 2–3 alternative job title options that accurately reflect the role and seniority level.

## Summary
Write a 2–4 sentence overview of the role. Describe what the person will do, the impact they will have, and who they will work with. If "why a candidate should want this position" data was provided, weave it naturally into this section.

## About the Company
Write 2–3 sentences introducing the company. Use the provided company information if available, otherwise write a brief placeholder.

## Responsibilities
List 6–10 bullet points describing the key day-to-day responsibilities and ownership areas. Start each point with an action verb.

## Requirements (Must-have)
List the essential skills, experience, and qualifications. Use the must-have requirements as the primary source. Include education, language skills, driver's license, and certificates/trainings where provided.

## Nice-to-have
List 3–6 bullet points covering additional skills that are advantageous but not mandatory. Use the nice-to-have requirements if provided.

## Why Join Us
If "why a candidate should want this position" data was provided, expand it into an engaging paragraph or 3–5 bullet points that highlight what makes this role and company attractive. If position goals were provided, mention growth opportunities. Otherwise write appropriate motivational copy.

## Benefits
List the benefits and perks. Use the provided benefits if available. If salary information is provided, include it here.

## Hiring Process
Describe the hiring process in 3–5 clear steps.

## Equal Opportunity Statement
Write a concise equal opportunity and inclusion statement.

---

Guidelines:
- Tone: professional, warm, non-discriminatory, and clear.
- Avoid gendered language (use "they/them" when referring to the candidate).
- Keep bullet points concise (one idea per point).
- Do not add any sections beyond those listed above.`;
}
