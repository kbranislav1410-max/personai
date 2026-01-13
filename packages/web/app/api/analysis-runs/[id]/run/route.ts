import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { scoreCandidate, extractCandidateName } from '@/lib/scoring-engine';

type Params = Promise<{ id: string }>;

// POST /api/analysis-runs/[id]/run - Execute analysis run and compute candidate scores
export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const analysisRunId = parseInt(id, 10);

    if (isNaN(analysisRunId)) {
      return errorResponse('Invalid analysis run ID', 400);
    }

    // Load analysis run with position
    const analysisRun = await prisma.analysisRun.findUnique({
      where: { id: analysisRunId },
      include: {
        Position: true,
      },
    });

    if (!analysisRun) {
      return errorResponse('Analysis run not found', 404);
    }

    // Check if already completed
    if (analysisRun.status === 'done') {
      // Return existing results
      const existingResults = await prisma.analysisRun.findUnique({
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
      return successResponse(existingResults);
    }

    // Update status to running
    await prisma.analysisRun.update({
      where: { id: analysisRunId },
      data: { status: 'running' },
    });

    // Get all resumes with rawText extracted
    // For MVP: We'll assume resumes have been uploaded and text extracted
    // In production, you'd want to filter by specific resumes selected for this analysis
    const resumes = await prisma.resume.findMany({
      where: {
        rawText: {
          not: '',
        },
      },
      include: {
        Candidate: true,
      },
    });

    if (resumes.length === 0) {
      await prisma.analysisRun.update({
        where: { id: analysisRunId },
        data: { status: 'failed' },
      });
      return errorResponse('No resumes with extracted text found', 400);
    }

    // Get parsing weights from request body (optional)
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // No body or invalid JSON, use defaults
    }

    const weights = body.weights || {
      mustHave: 70,
      niceToHave: 20,
      custom: 10,
    };

    // Process each resume and create candidate scores
    const candidateScores = [];

    for (const resume of resumes) {
      // Check if candidate already exists, if not create one
      let candidate = resume.Candidate;

      // If candidate doesn't have a proper name, extract it from resume text
      if (!candidate.fullName || candidate.fullName === resume.fileName) {
        const extractedName = extractCandidateName(resume.rawText, resume.fileName);
        candidate = await prisma.candidate.update({
          where: { id: candidate.id },
          data: { fullName: extractedName },
        });
      }

      // Score the candidate
      const scoringResult = scoreCandidate({
        resumeText: resume.rawText,
        mustHaveRequirements: analysisRun.Position.mustHave,
        niceToHaveRequirements: analysisRun.Position.niceToHave,
        customRequirements: analysisRun.customRequirements || undefined,
        weights,
      });

      // Create candidate score record
      const candidateScore = await prisma.candidateScore.create({
        data: {
          analysisRunId: analysisRun.id,
          candidateId: candidate.id,
          score: scoringResult.score,
          recommendation: scoringResult.recommendation,
          summary: scoringResult.summary,
          strengths: scoringResult.strengths,
          gaps: scoringResult.gaps,
        },
        include: {
          Candidate: true,
        },
      });

      candidateScores.push(candidateScore);
    }

    // Update analysis run status to done
    await prisma.analysisRun.update({
      where: { id: analysisRunId },
      data: { status: 'done' },
    });

    // Return the completed analysis run with results
    const completedRun = await prisma.analysisRun.findUnique({
      where: { id: analysisRunId },
      include: {
        Position: true,
        CandidateScore: {
          include: {
            Candidate: true,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
    });

    return successResponse({
      message: `Analysis completed successfully. Processed ${candidateScores.length} candidate(s).`,
      analysisRun: completedRun,
    });
  } catch (error) {
    console.error('Error running analysis:', error);

    // Try to update status to failed
    try {
      const { id } = await params;
      const analysisRunId = parseInt(id, 10);
      if (!isNaN(analysisRunId)) {
        await prisma.analysisRun.update({
          where: { id: analysisRunId },
          data: { status: 'failed' },
        });
      }
    } catch {
      // Ignore error updating status
    }

    return errorResponse('Failed to run analysis', 500);
  }
}
