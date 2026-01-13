import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { createAnalysisRunSchema } from '@/lib/validation';

// GET /api/analysis-runs - Get all analysis runs
export async function GET() {
  try {
    const analysisRuns = await prisma.analysisRun.findMany({
      include: {
        Position: {
          select: {
            title: true,
          },
        },
        CandidateScore: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(analysisRuns);
  } catch (error) {
    console.error('Error fetching analysis runs:', error);
    return errorResponse('Failed to fetch analysis runs', 500);
  }
}

// POST /api/analysis-runs - Create a new analysis run
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createAnalysisRunSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    // Check if position exists
    const position = await prisma.position.findUnique({
      where: { id: validationResult.data.positionId },
    });

    if (!position) {
      return errorResponse('Position not found', 404);
    }

    // Create analysis run with default status 'queued'
    const analysisRun = await prisma.analysisRun.create({
      data: {
        positionId: validationResult.data.positionId,
        customRequirements: validationResult.data.customRequirements,
        status: 'queued',
      },
    });

    return successResponse(analysisRun, 201);
  } catch (error) {
    console.error('Error creating analysis run:', error);
    return errorResponse('Failed to create analysis run', 500);
  }
}
