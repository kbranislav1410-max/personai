import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { extractResumeText } from '@/lib/text-extraction';

type Params = Promise<{ id: string }>;

// POST /api/resumes/[id]/extract-text - Extract text from resume file
export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const resumeId = parseInt(id, 10);

    if (isNaN(resumeId)) {
      return errorResponse('Invalid resume ID', 400);
    }

    // Load resume record
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return errorResponse('Resume not found', 404);
    }

    // Check if text has already been extracted
    if (resume.rawText && resume.rawText.length > 0) {
      return successResponse({
        message: 'Text already extracted',
        resume,
      });
    }

    // Extract text from the file
    let extractedText: string;
    try {
      extractedText = await extractResumeText(resume.storagePath, resume.fileType);
    } catch (error) {
      console.error('Text extraction failed:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to extract text from resume',
        500
      );
    }

    // Update resume with extracted text
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: { rawText: extractedText },
    });

    return successResponse({
      message: 'Text extracted successfully',
      resume: updatedResume,
    });
  } catch (error) {
    console.error('Error in extract-text endpoint:', error);
    return errorResponse('Failed to extract text from resume', 500);
  }
}
