import { z } from 'zod';

export const submitAttendanceSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  date: z.string().datetime('Invalid date format'),
  records: z
    .array(
      z.object({
        student: z.string().min(1, 'Student ID is required'),
        status: z.enum(['Present', 'Absent'], {
          errorMap: () => ({ message: 'Status must be Present or Absent' }),
        }),
      })
    )
    .min(1, 'At least one attendance record is required'),
});

export const getAttendanceQuerySchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v, 10)),
  limit: z.string().optional().transform((v) => parseInt(v, 10)),
  subjectId: z.string().optional(),
  studentId: z.string().optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const getStudentAttendanceQuerySchema = z.object({
  semester: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
