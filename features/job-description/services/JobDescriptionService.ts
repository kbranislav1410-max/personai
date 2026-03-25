import { buildJobDescriptionPrompt } from "../prompts/buildJobDescriptionPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";

export interface GenerateJobDescriptionInput {
  description: string;
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

export async function generateJobDescriptionText(
  input: GenerateJobDescriptionInput
): Promise<string> {
  const prompt = buildJobDescriptionPrompt(input);
  return generateText(prompt);
}
