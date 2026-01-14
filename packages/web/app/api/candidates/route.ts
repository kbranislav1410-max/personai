import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

// Validation schema for creating a candidate
const createCandidateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// GET /api/candidates - List all candidates
export async function GET(request: NextRequest) {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        Resume: {
          select: {
            id: true,
          },
        },
        CandidateScore: {
          select: {
            id: true,
            score: true,
            recommendation: true,
            status: true,
            AnalysisRun: {
              select: {
                createdAt: true,
              },
            },
          },
          orderBy: {
            AnalysisRun: {
              createdAt: 'desc',
            },
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to include resume count and latest score
    const transformedCandidates = candidates.map(candidate => ({
      ...candidate,
      resumeCount: candidate.Resume.length,
      latestScore: candidate.CandidateScore[0] || null,
    }));

    return successResponse(transformedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return errorResponse('Failed to fetch candidates', 500);
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createCandidateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.errors[0].message,
        400
      );
    }

    const { fullName, email, phone, location } = validation.data;

    // Check if email already exists (if provided)
    if (email && email.trim() !== '') {
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email },
      });

      if (existingCandidate) {
        return errorResponse('A candidate with this email already exists', 400);
      }
    }

    const candidate = await prisma.candidate.create({
      data: {
        fullName,
        email: email && email.trim() !== '' ? email : null,
        phone: phone || null,
        location: location || null,
      },
    });

    return successResponse(candidate, 201);
  } catch (error) {
    console.error('Error creating candidate:', error);
    return errorResponse('Failed to create candidate', 500);
  }
}
