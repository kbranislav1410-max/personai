import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { updatePositionSchema } from '@/lib/validation';

type Params = Promise<{ id: string }>;

// GET /api/positions/[id] - Retrieve a single position by ID
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const positionId = parseInt(id, 10);

    if (isNaN(positionId)) {
      return errorResponse('Invalid position ID', 400);
    }

    const position = await prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      return errorResponse('Position not found', 404);
    }

    return successResponse(position);
  } catch (error) {
    console.error('Error fetching position:', error);
    return errorResponse('Failed to fetch position', 500);
  }
}

// PUT /api/positions/[id] - Update a position by ID
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const positionId = parseInt(id, 10);

    if (isNaN(positionId)) {
      return errorResponse('Invalid position ID', 400);
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updatePositionSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    const position = await prisma.position.update({
      where: { id: positionId },
      data: validationResult.data,
    });

    return successResponse(position);
  } catch (error) {
    console.error('Error updating position:', error);
    // Check if error is due to record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return errorResponse('Position not found', 404);
    }
    return errorResponse('Failed to update position', 500);
  }
}

// DELETE /api/positions/[id] - Delete a position by ID
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const positionId = parseInt(id, 10);

    if (isNaN(positionId)) {
      return errorResponse('Invalid position ID', 400);
    }

    await prisma.position.delete({
      where: { id: positionId },
    });

    return successResponse({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error);
    // Check if error is due to record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return errorResponse('Position not found', 404);
    }
    return errorResponse('Failed to delete position', 500);
  }
}
