import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import departmentRoutes from './departments.js';
import subjectRoutes from './subjects.js';
import attendanceRoutes from './attendance.js';
import assessmentRoutes from './assessments.js';
import dashboardRoutes from './dashboards.js';
import noticeRoutes from './notices.js';
import timetableRoutes from './timetables.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notices', noticeRoutes);
router.use('/timetables', timetableRoutes);

export default router;
