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
  companyName?: string;
  industry?: string;
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
    companyName,
    industry,
    benefits,
    companyInfo,
    toneOfVoice,
    toneOfVoiceCustom,
  } = input;

  const positionName =
    positionTemplate === "Vlastná pozícia..."
      ? positionCustom ?? description
      : positionTemplate ?? description;

  // ── Output language ──────────────────────────────────────────────────────
  const outputLanguageInstruction =
    language === "SK"
      ? "Write the entire job description in Slovak (slovenčina)."
      : "Write the entire job description in English.";

  // ── Company context block ────────────────────────────────────────────────
  const companyLines: string[] = [];
  if (companyName) companyLines.push(`Company name: ${companyName}`);
  if (industry) companyLines.push(`Industry: ${industry}`);
  if (companyInfo) companyLines.push(`Company description: ${companyInfo}`);
  if (benefits) companyLines.push(`Benefits: ${benefits}`);

  const companyBlock =
    companyLines.length > 0
      ? `### COMPANY DATA\n${companyLines.join("\n")}`
      : "";

  // ── Communication DNA block ──────────────────────────────────────────────
  let communicationBlock = "";
  if (toneOfVoice || toneOfVoiceCustom) {
    const toneLines: string[] = [];
    if (toneOfVoice) toneLines.push(`- Tone of voice style: ${toneOfVoice}`);
    if (toneOfVoiceCustom) toneLines.push(`- Additional tone guidance: ${toneOfVoiceCustom}`);
    communicationBlock = `### COMPANY COMMUNICATION DNA
Apply the following communication style throughout the entire job description:
${toneLines.join("\n")}
- Mimic the company's natural communication style; avoid generic corporate language.
- If the tone is friendly/startup-like, use shorter sentences and more energy.
- If the tone is formal/conservative, use precise and measured language.
- Adjust energy level accordingly: dynamic for modern tones, neutral for formal ones.`;
  }

  // ── Role context block ───────────────────────────────────────────────────
  const roleLines: string[] = [];
  if (positionName) roleLines.push(`Position: ${positionName}`);
  if (seniority) roleLines.push(`Seniority level: ${seniority}`);
  if (jobContent) roleLines.push(`What the person will do (job content):\n${jobContent}`);

  const teamParts = [
    teamSize && `size: ${teamSize}`,
    teamType && `type: ${teamType}`,
    teamAverageAge && `average age: ${teamAverageAge}`,
  ].filter(Boolean);
  if (teamParts.length) roleLines.push(`Team context – ${teamParts.join(", ")}`);

  if (positionGoal) roleLines.push(`Role goal (next 3–6 months): ${positionGoal}`);
  if (whyApply) roleLines.push(`Why a candidate should want this position: ${whyApply}`);

  const roleBlock =
    roleLines.length > 0
      ? `### ROLE CONTEXT\n${roleLines.join("\n\n")}`
      : `### ROLE CONTEXT\nRole description: ${description}`;

  // ── Requirements block ───────────────────────────────────────────────────
  const reqLines: string[] = [];
  if (mustHave) reqLines.push(`Must-have requirements:\n${mustHave}`);
  if (niceToHave) reqLines.push(`Nice-to-have requirements:\n${niceToHave}`);

  const requirementsBlock =
    reqLines.length > 0 ? `### REQUIREMENTS\n${reqLines.join("\n\n")}` : "";

  // ── Conditions block ─────────────────────────────────────────────────────
  const conditionLines: string[] = [];
  if (location) conditionLines.push(`Location: ${location}`);
  if (employmentType) conditionLines.push(`Employment type: ${employmentType}`);
  if (salary) conditionLines.push(`Salary / compensation: ${salary}`);
  if (languageSkillsSerialized) conditionLines.push(`Required languages: ${languageSkillsSerialized}`);
  if (driverLicense && driverLicense !== "Nie je požiadavka") conditionLines.push(`Driver's license: ${driverLicense}`);
  if (certificates) conditionLines.push(`Certificates / trainings: ${certificates}`);
  if (educationRequired && educationLevel) {
    const eduLine = [
      `Education: ${educationLevel}`,
      educationFields && `field(s): ${educationFields}`,
    ]
      .filter(Boolean)
      .join(", ");
    conditionLines.push(eduLine);
  }

  const conditionsBlock =
    conditionLines.length > 0
      ? `### CONDITIONS & OTHER REQUIREMENTS\n${conditionLines.join("\n")}`
      : "";

  // ── Assemble all data blocks ─────────────────────────────────────────────
  const dataBlocks = [companyBlock, roleBlock, requirementsBlock, conditionsBlock]
    .filter(Boolean)
    .join("\n\n");

  return `You are an experienced HR specialist and recruiter who writes clear, engaging, and realistic job descriptions tailored to a specific company and role.

${outputLanguageInstruction}

---

## BEHAVIOR RULES (follow strictly)
- Do NOT generate generic filler phrases. Every sentence must reflect the specific data provided.
- Do NOT hallucinate or invent company facts, technologies, or benefits not mentioned in the input.
- Adapt the tone strictly to the company's communication DNA (see below).
- Adjust the complexity and responsibility scope based on the seniority level provided.
- Use natural, human language. Avoid corporate buzzwords unless they match the company tone.
- Avoid unnecessary repetition between sections.
- Be specific and concrete. Vague descriptions are not acceptable.
- Avoid gendered language; refer to the candidate as "they/them" or use neutral forms.

---

## INPUT DATA

${dataBlocks}

---

## REASONING STEP (internal, before writing)
Before generating any output, think through the following:
1. What does this role actually involve at the given seniority level? Adjust responsibilities accordingly.
2. What tone fits this company — energetic, calm, precise, inspirational? Lock in the tone.
3. What makes this specific role attractive? Use the candidate motivation data if available.
4. Are all provided data points reflected naturally in the output?

---

## OUTPUT INSTRUCTIONS

Generate two complete versions of the job description, clearly labelled.

**VERSION 1 – PROFESSIONAL**
A polished, formal job description that is clear, structured, and credible. Suitable for LinkedIn or a careers page targeting experienced professionals.

**VERSION 2 – ENGAGING / MODERN**
A more dynamic, conversational version of the same job description. Use a warmer tone, more active language, and make the role feel exciting and human. Suitable for social media or attracting candidates who value culture fit.

Both versions must include ALL of the following sections in this exact order:

1. **Job Title** — one clear title that matches the position and seniority
2. **About the Company** — 2–3 sentences introducing the company (adapted from the input, not copied verbatim)
3. **About the Role** — 2–4 sentence overview of the role: what the person will do, who they will work with, the impact they will have
4. **Responsibilities** — 6–10 bullet points starting with action verbs; reflect the seniority level
5. **Requirements** — essential must-have skills, experience, qualifications, languages, education, driver's license, certificates (use provided data)
6. **Nice to Have** — 3–6 bullet points for advantageous but non-mandatory skills
7. **What We Offer** — benefits and perks based on provided data; include candidate motivation points if provided
8. **Salary** — include only if salary data was provided; otherwise omit this section entirely
9. **Location & Work Setup** — location, employment type, and any relevant work arrangement details

---

## FINAL QUALITY CHECK (apply after generating both versions)
Review and improve each version:
- Remove any remaining generic phrases.
- Ensure the tone matches the company's communication DNA exactly.
- Confirm every section is specific to this role and company, not interchangeable with another posting.
- Make the text more engaging where possible without adding hallucinated information.`;
}

