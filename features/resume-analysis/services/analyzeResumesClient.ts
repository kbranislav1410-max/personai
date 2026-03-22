import {
  AnalyzeResumesRequest,
  AnalyzeResumesResponse,
} from "../types";

/**
 * Calls the /api/analyze-resumes endpoint and returns the AI analysis results.
 */
export async function analyzeResumesClient(
  request: AnalyzeResumesRequest
): Promise<AnalyzeResumesResponse> {
  const res = await fetch("/api/analyze-resumes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      positionTitle: request.positionTitle,
      positionContent: request.positionContent,
      resumes: request.resumes,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Failed to analyze resumes.");
  }

  return json as AnalyzeResumesResponse;
}
