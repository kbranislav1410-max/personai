import { InterviewPrepRequest, InterviewPrepResponse } from "../types";

/**
 * Client-side function that calls the /api/prepare-interview endpoint.
 */
export async function prepareInterviewClient(
  data: InterviewPrepRequest
): Promise<InterviewPrepResponse> {
  const res = await fetch("/api/prepare-interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(
      (json as { error?: string }).error ??
        "Príprava na pohovor zlyhala. Skúste to neskôr."
    );
  }

  return res.json() as Promise<InterviewPrepResponse>;
}
