import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/candidates/[id] - Get a single candidate with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);

    if (isNaN(candidateId)) {
      return errorResponse('Invalid candidate ID', 400);
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        Resume: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        CandidateScore: {
          include: {
            AnalysisRun: {
              include: {
                Position: {
                  select: {
                    id: true,
                    title: true,
                    department: true,
                  },
                },
              },
            },
          },
          orderBy: {
            AnalysisRun: {
              createdAt: 'desc',
            },
          },
        },
      },
    });

    if (!candidate) {
      return errorResponse('Candidate not found', 404);
    }

    return successResponse(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return errorResponse('Failed to fetch candidate', 500);
  }
}
