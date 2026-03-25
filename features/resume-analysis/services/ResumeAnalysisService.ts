import { buildResumeAnalysisPrompt } from "../prompts/buildResumeAnalysisPrompt";
import { generateText } from "@/lib/ai/OpenAIClient";
import { ResumeFile, ResumeAnalysisResult, SuitabilityScore } from "../types";

const SCORE_REGEX = /^SKORE_VHODNOSTI:\s*([1-5])\s*$/m;
const CONTACT_NAME_REGEX = /^KONTAKT_MENO:\s*(.+)$/m;
const CONTACT_EMAIL_REGEX = /^KONTAKT_EMAIL:\s*(.+)$/m;
const CONTACT_PHONE_REGEX = /^KONTAKT_TELEFON:\s*(.+)$/m;
const CONTACT_ADDRESS_REGEX = /^KONTAKT_ADRESA:\s*(.+)$/m;

const RATING_LABELS: Record<SuitabilityScore, string> = {
  5: "Veľmi vhodný",
  4: "Vhodný",
  3: "Neutrálny",
  2: "Nevhodný",
  1: "Veľmi nevhodný",
};

/** Extract a single-line structured tag and return its value, or undefined if absent/empty/dash. */
function extractTag(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  if (!match) return undefined;
  const value = match[1].trim();
  return value === "" || value === "—" ? undefined : value;
}

function parseResponse(text: string): {
  score: SuitabilityScore;
  cleanedAnalysis: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
} {
  const scoreMatch = text.match(SCORE_REGEX);
  const score = scoreMatch ? (Number(scoreMatch[1]) as SuitabilityScore) : 3;

  const contactName = extractTag(text, CONTACT_NAME_REGEX);
  const contactEmail = extractTag(text, CONTACT_EMAIL_REGEX);
  const contactPhone = extractTag(text, CONTACT_PHONE_REGEX);
  const contactAddress = extractTag(text, CONTACT_ADDRESS_REGEX);

  // Remove all structured tag lines from the visible analysis text
  const cleanedAnalysis = text
    .replace(/^SKORE_VHODNOSTI:.*$/m, "")
    .replace(/^KONTAKT_MENO:.*$/m, "")
    .replace(/^KONTAKT_EMAIL:.*$/m, "")
    .replace(/^KONTAKT_TELEFON:.*$/m, "")
    .replace(/^KONTAKT_ADRESA:.*$/m, "")
    .trimEnd();

  return { score, cleanedAnalysis, contactName, contactEmail, contactPhone, contactAddress };
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
      const { score, cleanedAnalysis, contactName, contactEmail, contactPhone, contactAddress } =
        parseResponse(rawAnalysis);
      return {
        filename: resume.filename,
        analysis: cleanedAnalysis,
        score,
        ratingLabel: RATING_LABELS[score],
        contactName,
        contactEmail,
        contactPhone,
        contactAddress,
      };
    })
  );

  return results;
}

