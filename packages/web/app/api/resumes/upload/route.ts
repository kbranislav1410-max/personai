import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/validation';
import type { Resume } from '@prisma/client';

// Helper function to generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString('hex');
  const lastDotIndex = originalName.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    // No extension found (should not happen due to validation, but handle it anyway)
    return `${originalName}-${timestamp}-${randomString}`;
  }
  
  const extension = originalName.substring(lastDotIndex);
  const nameWithoutExt = originalName.substring(0, lastDotIndex);
  return `${nameWithoutExt}-${timestamp}-${randomString}${extension}`;
}

// Helper function to validate file
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File ${file.name} exceeds maximum size of 5MB`,
    };
  }

  // Check file extension
  const lastDotIndex = file.name.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      valid: false,
      error: `File ${file.name} has no extension. Only PDF and DOCX files are allowed`,
    };
  }
  
  const extension = file.name.substring(lastDotIndex).toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File ${file.name} has invalid type. Only PDF and DOCX files are allowed`,
    };
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File ${file.name} has invalid MIME type. Only PDF and DOCX files are allowed`,
    };
  }

  return { valid: true };
}

// POST /api/resumes/upload - Upload resume files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get candidateId from form data
    const candidateIdStr = formData.get('candidateId');
    if (!candidateIdStr) {
      return errorResponse('candidateId is required', 400);
    }

    const candidateId = parseInt(candidateIdStr.toString(), 10);
    if (isNaN(candidateId)) {
      return errorResponse('Invalid candidateId', 400);
    }

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return errorResponse('Candidate not found', 404);
    }

    // Get all files from form data
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return errorResponse('No files provided', 400);
    }

    // Validate all files first
    const validationErrors: string[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        validationErrors.push(validation.error!);
      }
    }

    if (validationErrors.length > 0) {
      return errorResponse(validationErrors.join('; '), 400);
    }

    // Process and save files
    const createdResumes: Resume[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(file.name);
      const filePath = join(uploadDir, uniqueFilename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Determine file type (safe here because validation already checked for extension)
      const lastDotIndex = file.name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex).toLowerCase() : '';
      const fileType = extension === '.pdf' ? 'pdf' : 'docx';

      // Create Resume record in database
      const resume = await prisma.resume.create({
        data: {
          candidateId,
          fileName: file.name,
          fileType,
          fileUrl: `/uploads/${uniqueFilename}`,
          storagePath: filePath,
          rawText: '', // TODO: Implement text extraction service to populate this field with resume content
        },
      });

      createdResumes.push(resume);
    }

    return successResponse(
      {
        message: `Successfully uploaded ${createdResumes.length} file(s)`,
        resumes: createdResumes,
      },
      201
    );
  } catch (error) {
    console.error('Error uploading resumes:', error);
    return errorResponse('Failed to upload resumes', 500);
  }
}
