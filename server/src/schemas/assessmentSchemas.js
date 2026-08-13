import { z } from 'zod';

export const createAssessmentSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  title: z.string().min(1, 'Assessment title is required'),
  description: z.string().optional(),
  maxMarks: z.number().positive('Max marks must be positive'),
  assessmentType: z.enum(['internal', 'assignment', 'exam']).optional(),
  dueDate: z.string().datetime().optional(),
  records: z
    .array(
      z.object({
        student: z.string().min(1, 'Student ID is required'),
        marksObtained: z.number().min(0, 'Marks cannot be negative'),
        remarks: z.string().optional(),
      })
    )
    .optional(),
});

export const updateAssessmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  maxMarks: z.number().positive().optional(),
  assessmentType: z.enum(['internal', 'assignment', 'exam']).optional(),
  dueDate: z.string().datetime().optional(),
});

export const submitMarksSchema = z.object({
  records: z
    .array(
      z.object({
        student: z.string().min(1, 'Student ID is required'),
        marksObtained: z.number().min(0, 'Marks cannot be negative'),
        remarks: z.string().optional(),
      })
    )
    .min(1, 'At least one mark record is required'),
});

export const getAssessmentsQuerySchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v, 10)),
  limit: z.string().optional().transform((v) => parseInt(v, 10)),
  subjectId: z.string().optional(),
  assessmentType: z.enum(['internal', 'assignment', 'exam']).optional(),
});
