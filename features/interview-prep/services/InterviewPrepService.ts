import { buildInterviewPrepPrompt } from "../prompts/buildInterviewPrepPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";

/**
 * Server-side service that generates a complete interview preparation guide
 * for a specific candidate based on their AI analysis.
 */
export async function prepareInterview(
  positionTitle: string,
  candidateFilename: string,
  candidateAnalysis: string
): Promise<string> {
  const prompt = buildInterviewPrepPrompt(
    positionTitle,
    candidateFilename,
    candidateAnalysis
  );
  return generateText(prompt);
}
