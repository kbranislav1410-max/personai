import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { JobFormData, Platform } from "@/types/job";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, platforms }: { formData: JobFormData; platforms: Platform[] } = body;

    if (!formData || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Missing formData or platforms" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const results: Partial<Record<Platform, string>> = {};

    await Promise.all(
      platforms.map(async (platform) => {
        const systemPrompt = buildSystemPrompt(platform);
        const userPrompt = buildUserPrompt(platform, formData);

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });

        results[platform] = completion.choices[0]?.message?.content ?? "";
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error generating job ad:", error);
    return NextResponse.json(
      { error: "Failed to generate job ad" },
      { status: 500 }
    );
  }
}
