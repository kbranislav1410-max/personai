import { buildJobDescriptionPrompt } from "../prompts/buildJobDescriptionPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";

export interface GenerateJobDescriptionInput {
  description: string;
  language: "SK" | "EN";
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
  toneOfVoice?: string;
  toneOfVoiceCustom?: string;
}

/**
 * Server-side service that orchestrates prompt building and AI text generation
 * to produce a complete job description.
 *
 * This is the single entry-point for the job-description feature's generation
 * logic. The API route delegates here; it only handles HTTP concerns itself.
 */
export async function generateJobDescriptionText(
  input: GenerateJobDescriptionInput
): Promise<string> {
  const prompt = buildJobDescriptionPrompt(input);
  return generateText(prompt);
}
