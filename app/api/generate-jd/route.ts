import { NextRequest, NextResponse } from "next/server";
import { generateJobDescriptionText } from "@/features/job-description/services/JobDescriptionService";

const DESCRIPTION_MAX_LENGTH = 2000;

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { description, language, seniority, location, employmentType } =
    (body as Record<string, unknown>) ?? {};

  if (typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'description' is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return NextResponse.json(
      {
        error: `Field 'description' must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  if (language !== "SK" && language !== "EN") {
    return NextResponse.json(
      { error: "Field 'language' is required and must be 'SK' or 'EN'." },
      { status: 400 }
    );
  }

  try {
    const jobDescription = await generateJobDescriptionText({
      description: description.trim(),
      language,
      seniority: typeof seniority === "string" ? seniority : undefined,
      location: typeof location === "string" ? location : undefined,
      employmentType: typeof employmentType === "string" ? employmentType : undefined,
    });
    return NextResponse.json({ jobDescription }, { status: 200 });
  } catch (err) {
    console.error("[generate-jd] Service error:", err);
    return NextResponse.json(
      { error: "Failed to generate job description. Please try again later." },
      { status: 500 }
    );
  }
}
