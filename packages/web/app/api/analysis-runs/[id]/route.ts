import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

type Params = Promise<{ id: string }>;

// GET /api/analysis-runs/[id] - Retrieve an analysis run with candidate scores
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const analysisRunId = parseInt(id, 10);

    if (isNaN(analysisRunId)) {
      return errorResponse('Invalid analysis run ID', 400);
    }

    const analysisRun = await prisma.analysisRun.findUnique({
      where: { id: analysisRunId },
      include: {
        Position: true,
        CandidateScore: {
          include: {
            Candidate: true,
          },
        },
      },
    });

    if (!analysisRun) {
      return errorResponse('Analysis run not found', 404);
    }

    return successResponse(analysisRun);
  } catch (error) {
    console.error('Error fetching analysis run:', error);
    return errorResponse('Failed to fetch analysis run', 500);
  }
}
