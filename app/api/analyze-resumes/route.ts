import { NextRequest, NextResponse } from "next/server";
import { analyzeResumes } from "@/features/resume-analysis/services/ResumeAnalysisService";
import { ResumeFile } from "@/features/resume-analysis/types";

const MAX_RESUMES = 10;
const MAX_RESUME_TEXT_LENGTH = 20000;

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { positionTitle, positionContent, resumes } =
    (body as Record<string, unknown>) ?? {};

  if (typeof positionTitle !== "string" || positionTitle.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'positionTitle' is required." },
      { status: 400 }
    );
  }

  if (
    typeof positionContent !== "string" ||
    positionContent.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Field 'positionContent' is required." },
      { status: 400 }
    );
  }

  if (!Array.isArray(resumes) || resumes.length === 0) {
    return NextResponse.json(
      { error: "Field 'resumes' must be a non-empty array." },
      { status: 400 }
    );
  }

  if (resumes.length > MAX_RESUMES) {
    return NextResponse.json(
      { error: `You can analyze at most ${MAX_RESUMES} resumes at a time.` },
      { status: 400 }
    );
  }

  const parsedResumes: ResumeFile[] = [];

  for (const item of resumes) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).filename !== "string" ||
      typeof (item as Record<string, unknown>).text !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Each resume must be an object with 'filename' and 'text' string fields.",
        },
        { status: 400 }
      );
    }

    const r = item as { filename: string; text: string };

    if (r.text.length > MAX_RESUME_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Resume '${r.filename}' exceeds the maximum allowed length of ${MAX_RESUME_TEXT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    parsedResumes.push({ filename: r.filename, text: r.text });
  }

  try {
    const results = await analyzeResumes(
      positionTitle.trim(),
      positionContent.trim(),
      parsedResumes
    );
    return NextResponse.json({ results }, { status: 200 });
  } catch (err) {
    console.error("[analyze-resumes] Service error:", err);
    return NextResponse.json(
      { error: "Analýza životopisov zlyhala. Skúste to neskôr." },
      { status: 500 }
    );
  }
}
