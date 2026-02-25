import { JobDescriptionFormData, JobDescriptionResult } from "../types";

/**
 * Calls the /api/generate-jd endpoint to produce an AI-generated job description.
 */
export async function generateJobDescription(
  data: JobDescriptionFormData
): Promise<JobDescriptionResult> {
  const res = await fetch("/api/generate-jd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: data.roleDescription,
      language: data.language,
      seniority: data.seniority,
      location: data.location,
      employmentType: data.employmentType,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Failed to generate job description.");
  }

  return { content: json.jobDescription };
}
