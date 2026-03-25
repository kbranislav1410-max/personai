import { NextRequest, NextResponse } from "next/server";
import { analyzeResumes } from "@/features/resume-analysis/services/ResumeAnalysisService";
import { ResumeFile } from "@/features/resume-analysis/types";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const MAX_RESUMES = 10;
const MAX_RESUME_TEXT_LENGTH = 50000;

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  }
  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  return buffer.toString("utf-8");
}

export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart/form-data body." },
      { status: 400 }
    );
  }

  const positionTitle = formData.get("positionTitle");
  const positionContent = formData.get("positionContent");
  const resumeFiles = formData.getAll("resumes") as File[];

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

  if (resumeFiles.length === 0) {
    return NextResponse.json(
      { error: "At least one resume file is required." },
      { status: 400 }
    );
  }

  if (resumeFiles.length > MAX_RESUMES) {
    return NextResponse.json(
      { error: `You can analyze at most ${MAX_RESUMES} resumes at a time.` },
      { status: 400 }
    );
  }

  const parsedResumes: ResumeFile[] = [];

  for (const file of resumeFiles) {
    let text: string;
    try {
      text = await extractText(file);
    } catch {
      return NextResponse.json(
        {
          error: `Nepodarilo sa načítať súbor '${file.name}'. Skúste ho uložiť vo formáte PDF alebo TXT.`,
        },
        { status: 422 }
      );
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
      return NextResponse.json(
        {
          error: `Súbor '${file.name}' neobsahuje žiadny text. Uistite sa, že PDF nie je skenovaný obrázok.`,
        },
        { status: 422 }
      );
    }

    if (trimmed.length > MAX_RESUME_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Súbor '${file.name}' je príliš dlhý (${trimmed.length} znakov). Maximum je ${MAX_RESUME_TEXT_LENGTH} znakov.`,
        },
        { status: 422 }
      );
    }

    parsedResumes.push({ filename: file.name, text: trimmed });
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
