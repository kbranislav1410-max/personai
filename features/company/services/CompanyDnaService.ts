import {
  buildCompanyDnaPrompt,
  BuildCompanyDnaPromptInput,
} from "../prompts/buildCompanyDnaPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";

export async function generateCompanyDna(
  input: BuildCompanyDnaPromptInput
): Promise<string> {
  const prompt = buildCompanyDnaPrompt(input);
  return generateText(prompt);
}
