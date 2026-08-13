import { z } from 'zod';

export const createUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'faculty', 'student'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
  department: z.string().optional(),
  semester: z.number().int().positive().optional(),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'faculty', 'student']).optional(),
  department: z.string().optional(),
  semester: z.number().int().positive().optional(),
  phone: z.string().optional(),
});

export const getUsersQuerySchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v, 10)),
  limit: z.string().optional().transform((v) => parseInt(v, 10)),
  role: z.string().optional(),
  department: z.string().optional(),
  search: z.string().optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  code: z.string().min(1, 'Department code is required'),
  description: z.string().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  hod: z.string().optional(),
});
