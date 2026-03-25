import { buildResumeAnalysisPrompt } from "../prompts/buildResumeAnalysisPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";
import { ResumeFile, ResumeAnalysisResult, SuitabilityScore } from "../types";

const SCORE_REGEX = /SKORE_VHODNOSTI:\s*([1-5])\s*$/m;

const RATING_LABELS: Record<SuitabilityScore, string> = {
  5: "Veľmi vhodný",
  4: "Vhodný",
  3: "Neutrálny",
  2: "Nevhodný",
  1: "Veľmi nevhodný",
};

function parseScore(text: string): { score: SuitabilityScore; cleanedAnalysis: string } {
  const match = text.match(SCORE_REGEX);
  const score = match ? (Number(match[1]) as SuitabilityScore) : 3;
  // Remove the score tag line from the visible analysis text
  const cleanedAnalysis = text.replace(SCORE_REGEX, "").trimEnd();
  return { score, cleanedAnalysis };
}

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
      const rawAnalysis = await generateText(prompt);
      const { score, cleanedAnalysis } = parseScore(rawAnalysis);
      return {
        filename: resume.filename,
        analysis: cleanedAnalysis,
        score,
        ratingLabel: RATING_LABELS[score],
      };
    })
  );

  return results;
}

