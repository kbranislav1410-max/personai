import { NextRequest, NextResponse } from "next/server";
import { generateCompanyDna } from "@/features/company/services/CompanyDnaService";

function optStr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = (body as Record<string, unknown>) ?? {};

  const name = b.name;
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'name' is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  try {
    const communicationDna = await generateCompanyDna({
      name: name.trim(),
      description: optStr(b.description),
      industry: optStr(b.industry),
      benefits: optStr(b.benefits),
      toneOfVoice: optStr(b.toneOfVoice),
      toneOfVoiceCustom: optStr(b.toneOfVoiceCustom),
      otherInfo: optStr(b.otherInfo),
      otherGuides: optStr(b.otherGuides),
    });
    return NextResponse.json({ communicationDna }, { status: 200 });
  } catch (err) {
    console.error("[generate-company-dna] Service error:", err);
    return NextResponse.json(
      {
        error:
          "Generovanie Communication DNA zlyhalo. Skúste to neskôr.",
      },
      { status: 500 }
    );
  }
}
