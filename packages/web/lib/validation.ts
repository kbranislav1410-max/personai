import { z } from 'zod';

// Position validation schemas
export const createPositionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  seniority: z.string().min(1, 'Seniority is required'),
  description: z.string().optional(),
  mustHave: z.string().min(1, 'Must-have requirements are required'),
  niceToHave: z.string().min(1, 'Nice-to-have requirements are required'),
});

export const updatePositionSchema = z.object({
  title: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  seniority: z.string().min(1).optional(),
  description: z.string().optional(),
  mustHave: z.string().min(1).optional(),
  niceToHave: z.string().min(1).optional(),
}).refine(data => Object.getOwnPropertyNames(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// AnalysisRun validation schemas
export const createAnalysisRunSchema = z.object({
  positionId: z.number().int().positive('Position ID must be a positive integer'),
  customRequirements: z.string().min(1, 'Custom requirements are required'),
});

// Resume upload validation
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
export type CreateAnalysisRunInput = z.infer<typeof createAnalysisRunSchema>;
