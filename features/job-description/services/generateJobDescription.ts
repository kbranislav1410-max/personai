import { JobDescriptionFormData, JobDescriptionResult } from "../types";

/**
 * Mocked async function that simulates an AI API call.
 * Replace the body with a real API call when the backend is ready.
 */
export async function generateJobDescription(
  data: JobDescriptionFormData
): Promise<JobDescriptionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const content =
    `Job Title: ${data.seniority} – ${data.roleDescription}\n\n` +
    `Location: ${data.location}\n` +
    `Employment Type: ${data.employmentType}\n` +
    `Language: ${data.language}\n\n` +
    `About the Role:\n` +
    `We are looking for a ${data.seniority} professional to join our team. ` +
    `This is a ${data.employmentType} position based in ${data.location}.\n\n` +
    `Responsibilities:\n` +
    `• Lead and contribute to projects related to: ${data.roleDescription}\n` +
    `• Collaborate with cross-functional teams\n` +
    `• Drive continuous improvement\n\n` +
    `Requirements:\n` +
    `• Proven experience at ${data.seniority} level\n` +
    `• Strong communication skills\n` +
    `• Ability to work ${data.employmentType === "Full-time" ? "full time" : data.employmentType.toLowerCase()}\n\n` +
    `(This is a mocked response. Replace with real AI-generated content.)`;

  return { content };
}
