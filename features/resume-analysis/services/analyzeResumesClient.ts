import {
  AnalyzeResumesRequest,
  AnalyzeResumesResponse,
} from "../types";

/**
 * Calls the /api/analyze-resumes endpoint and returns the AI analysis results.
 * Files are sent as multipart/form-data so the server can handle PDFs.
 */
export async function analyzeResumesClient(
  request: AnalyzeResumesRequest
): Promise<AnalyzeResumesResponse> {
  const formData = new FormData();
  formData.append("positionTitle", request.positionTitle);
  formData.append("positionContent", request.positionContent);
  for (const file of request.files) {
    formData.append("resumes", file);
  }

  const res = await fetch("/api/analyze-resumes", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Failed to analyze resumes.");
  }

  return json as AnalyzeResumesResponse;
}
