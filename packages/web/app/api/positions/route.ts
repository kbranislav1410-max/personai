import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { createPositionSchema } from '@/lib/validation';

// GET /api/positions - Retrieve all positions
export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return errorResponse('Failed to fetch positions', 500);
  }
}

// POST /api/positions - Create a new position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = createPositionSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    const position = await prisma.position.create({
      data: validationResult.data,
    });

    return successResponse(position, 201);
  } catch (error) {
    console.error('Error creating position:', error);
    return errorResponse('Failed to create position', 500);
  }
}
