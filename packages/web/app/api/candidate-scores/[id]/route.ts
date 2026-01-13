import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const updateScoreSchema = z.object({
  decision: z.enum(['undecided', 'shortlist', 'reject']).optional(),
  status: z.enum(['pending', 'next_round', 'rejected']).optional(),
});

// PATCH /api/candidate-scores/[id] - Update candidate score fields
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
    const validationResult = updateScoreSchema.safeParse(body);
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

    // Build update data
    const updateData: any = {};
    if (validationResult.data.decision !== undefined) {
      updateData.decision = validationResult.data.decision;
    }
    if (validationResult.data.status !== undefined) {
      updateData.status = validationResult.data.status;
    }

    // Update the score
    const updatedScore = await prisma.candidateScore.update({
      where: { id: scoreId },
      data: updateData,
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
    console.error('Error updating candidate score:', error);
    return errorResponse('Failed to update candidate score', 500);
  }
}
