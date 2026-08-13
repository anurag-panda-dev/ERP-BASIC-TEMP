import { z } from 'zod';

export const createSubjectSchema = z.object({
  subjectCode: z.string().min(1, 'Subject code is required'),
  name: z.string().min(2, 'Subject name is required'),
  description: z.string().optional(),
  department: z.string().min(1, 'Department ID is required'),
  semester: z.number().int().positive('Semester must be positive'),
  credits: z.number().int().positive().default(3),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  credits: z.number().int().positive().optional(),
  assignedFaculty: z.string().optional(),
});

export const getSubjectsQuerySchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v, 10)),
  limit: z.string().optional().transform((v) => parseInt(v, 10)),
  department: z.string().optional(),
  semester: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  faculty: z.string().optional(),
});

export const enrollStudentSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'At least one student is required'),
});

export const assignFacultySchema = z.object({
  facultyId: z.string().min(1, 'Faculty ID is required'),
});
