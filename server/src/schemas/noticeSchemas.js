import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(1, 'Notice title is required'),
  content: z.string().min(1, 'Notice content is required'),
  audience: z.enum(['global', 'class', 'department']).optional(),
  targetSubject: z.string().optional(),
  targetDepartment: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  audience: z.enum(['global', 'class', 'department']).optional(),
  targetSubject: z.string().optional(),
  targetDepartment: z.string().optional(),
  isPublished: z.boolean().optional(),
  expiryDate: z.string().datetime().optional(),
});

export const getNoticesQuerySchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v, 10)),
  limit: z.string().optional().transform((v) => parseInt(v, 10)),
  audience: z.enum(['global', 'class', 'department']).optional(),
  search: z.string().optional(),
});
