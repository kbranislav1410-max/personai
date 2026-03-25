import { NextRequest, NextResponse } from "next/server";
import { prepareInterview } from "@/features/interview-prep/services/InterviewPrepService";

const MAX_ANALYSIS_LENGTH = 20000;

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { positionTitle, candidateFilename, candidateAnalysis } =
    (body as Record<string, unknown>) ?? {};

  if (typeof positionTitle !== "string" || positionTitle.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'positionTitle' is required." },
      { status: 400 }
    );
  }

  if (
    typeof candidateFilename !== "string" ||
    candidateFilename.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Field 'candidateFilename' is required." },
      { status: 400 }
    );
  }

  if (
    typeof candidateAnalysis !== "string" ||
    candidateAnalysis.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Field 'candidateAnalysis' is required." },
      { status: 400 }
    );
  }

  if (candidateAnalysis.length > MAX_ANALYSIS_LENGTH) {
    return NextResponse.json(
      {
        error: `Field 'candidateAnalysis' must not exceed ${MAX_ANALYSIS_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  try {
    const preparation = await prepareInterview(
      positionTitle.trim(),
      candidateFilename.trim(),
      candidateAnalysis.trim()
    );
    return NextResponse.json({ preparation }, { status: 200 });
  } catch (err) {
    console.error("[prepare-interview] Service error:", err);
    return NextResponse.json(
      { error: "Príprava na pohovor zlyhala. Skúste to neskôr." },
      { status: 500 }
    );
  }
}
