import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'next_round', 'rejected']),
});

// PATCH /api/candidate-scores/[id]/status - Update candidate score status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scoreId = parseInt(id);

    if (isNaN(scoreId)) {
      return errorResponse('Invalid score ID', 400);
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateStatusSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    // Check if candidate score exists
    const existingScore = await prisma.candidateScore.findUnique({
      where: { id: scoreId },
    });

    if (!existingScore) {
      return errorResponse('Candidate score not found', 404);
    }

    // Update status
    const updatedScore = await prisma.candidateScore.update({
      where: { id: scoreId },
      data: {
        status: validationResult.data.status,
      },
      include: {
        Candidate: true,
        AnalysisRun: {
          include: {
            Position: true,
          },
        },
      },
    });

    return successResponse(updatedScore);
  } catch (error) {
    console.error('Error updating candidate score status:', error);
    return errorResponse('Failed to update candidate score status', 500);
  }
}
