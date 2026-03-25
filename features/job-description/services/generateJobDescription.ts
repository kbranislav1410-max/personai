import { JobDescriptionFormData, JobDescriptionResult, LanguageSkill } from "../types";

function serializeLanguageSkills(skills: LanguageSkill[]): string {
  return skills.map((ls) => `${ls.language} (${ls.level})`).join(", ");
}

/**
 * Calls the /api/generate-jd endpoint to produce an AI-generated job description.
 */
export async function generateJobDescription(
  data: JobDescriptionFormData
): Promise<JobDescriptionResult> {
  const positionName =
    data.positionTemplate === "Vlastná pozícia..."
      ? data.positionCustom
      : data.positionTemplate;

  const res = await fetch("/api/generate-jd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: [positionName, data.jobContent].filter(Boolean).join(" – ") || data.roleDescription,
      language: data.language,

      // Section 1
      positionTemplate: data.positionTemplate,
      positionCustom: data.positionCustom,
      jobContent: data.jobContent,
      seniority: data.seniority,
      teamSize: data.teamSize,
      teamType: data.teamType,
      teamAverageAge: data.teamAverageAge,
      positionGoal: data.positionGoal,
      whyApply: data.whyApply,

      // Section 2
      mustHave: data.mustHave,
      niceToHave: data.niceToHave,

      // Section 3
      location: data.location,
      employmentType: data.employmentType,
      salary: data.salary,

      // Section 4
      languageSkillsSerialized: data.languageSkills.length
        ? serializeLanguageSkills(data.languageSkills)
        : undefined,
      driverLicense: data.driverLicense,
      certificates: data.certificates.filter(Boolean).join(", ") || undefined,
      educationRequired: data.educationRequired,
      educationLevel: data.educationLevel,
      educationFields: data.educationFields.filter(Boolean).join(", ") || undefined,

      // Company profile
      benefits: data.benefits,
      companyName: data.companyName,
      industry: data.industry,
      companyInfo: data.companyInfo,
      toneOfVoice: data.toneOfVoice,
      toneOfVoiceCustom: data.toneOfVoiceCustom,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Failed to generate job description.");
  }

  return { content: json.jobDescription };
}
