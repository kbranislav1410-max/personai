import { buildResumeAnalysisPrompt } from "../prompts/buildResumeAnalysisPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";
import { ResumeFile, ResumeAnalysisResult } from "../types";

/**
 * Server-side service that analyzes a list of CVs against a given job position.
 *
 * Each CV is evaluated independently so that the results are focused and
 * easy to compare.
 */
export async function analyzeResumes(
  positionTitle: string,
  positionContent: string,
  resumes: ResumeFile[]
): Promise<ResumeAnalysisResult[]> {
  const results = await Promise.all(
    resumes.map(async (resume) => {
      const prompt = buildResumeAnalysisPrompt(
        positionTitle,
        positionContent,
        resume
      );
      const analysis = await generateText(prompt);
      return { filename: resume.filename, analysis };
    })
  );

  return results;
}
