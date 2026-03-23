import { NextRequest, NextResponse } from "next/server";
import { generateJobDescriptionText } from "@/features/job-description/services/JobDescriptionService";

const DESCRIPTION_MAX_LENGTH = 2000;

function optStr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function optBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = (body as Record<string, unknown>) ?? {};

  const description = b.description;

  if (typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'description' is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Field 'description' must not exceed ${DESCRIPTION_MAX_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const language = b.language;
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

      positionTemplate: optStr(b.positionTemplate),
      positionCustom: optStr(b.positionCustom),
      jobContent: optStr(b.jobContent),
      seniority: optStr(b.seniority),
      teamSize: optStr(b.teamSize),
      teamType: optStr(b.teamType),
      teamAverageAge: optStr(b.teamAverageAge),
      positionGoal: optStr(b.positionGoal),
      whyApply: optStr(b.whyApply),

      mustHave: optStr(b.mustHave),
      niceToHave: optStr(b.niceToHave),

      location: optStr(b.location),
      employmentType: optStr(b.employmentType),
      salary: optStr(b.salary),

      languageSkillsSerialized: optStr(b.languageSkillsSerialized),
      driverLicense: optStr(b.driverLicense),
      certificates: optStr(b.certificates),
      educationRequired: optBool(b.educationRequired),
      educationLevel: optStr(b.educationLevel),
      educationFields: optStr(b.educationFields),

      benefits: optStr(b.benefits),
      companyInfo: optStr(b.companyInfo),
      toneOfVoice: optStr(b.toneOfVoice),
      toneOfVoiceCustom: optStr(b.toneOfVoiceCustom),
    });
    return NextResponse.json({ jobDescription }, { status: 200 });
  } catch (err) {
    console.error("[generate-jd] Service error:", err);
    return NextResponse.json(
      { error: "Generovanie pracovnej ponuky zlyhalo. Skúste to neskôr." },
      { status: 500 }
    );
  }
}
