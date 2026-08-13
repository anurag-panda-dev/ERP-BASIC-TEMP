import { RISK_THRESHOLDS } from '../config/constants.js';
import { calculateAggregateAttendance } from './attendanceService.js';
import { calculateAggregateMarks } from './assessmentService.js';
import Notice from '../models/Notice.js';
import Timetable from '../models/Timetable.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import { getPaginationParams } from '../utils/validators.js';

export const calculateRiskStatus = (attendancePercentage, marksPercentage) => {
  const attendance = attendancePercentage / 100;
  const marks = marksPercentage / 100;

  if (attendance < RISK_THRESHOLDS.RED.attendance || marks < RISK_THRESHOLDS.RED.marks) {
    return {
      status: 'RED',
      message: 'At Risk',
      description: 'Your academic standing requires immediate attention',
      color: '#EF4444',
    };
  }

  if (
    attendance < RISK_THRESHOLDS.YELLOW.attendance ||
    marks < RISK_THRESHOLDS.YELLOW.marks
  ) {
    return {
      status: 'YELLOW',
      message: 'Needs Improvement',
      description: 'Your academic performance needs improvement',
      color: '#F59E0B',
    };
  }

  return {
    status: 'GREEN',
    message: 'Good Standing',
    description: 'You are maintaining excellent academic performance',
    color: '#10B981',
  };
};

export const getStudentDashboard = async (studentId) => {
  try {
    const student = await User.findById(studentId)
      .populate('department')
      .populate('enrolledSubjects');

    if (!student) {
      throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
    }

    // Calculate attendance and marks
    const attendanceData = await calculateAggregateAttendance(studentId);
    const marksData = await calculateAggregateMarks(studentId);

    // Calculate risk status
    const riskStatus = calculateRiskStatus(
      attendanceData.overallPercentage,
      marksData.overallPercentage
    );

    // Get recent notices
    const notices = await Notice.find({
      $or: [
        { audience: 'global', isPublished: true },
        {
          audience: 'class',
          targetSubject: { $in: student.enrolledSubjects },
          isPublished: true,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name email role');

    // Get today's timetable
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const todaysTimetable = await Timetable.find({
      subject: { $in: student.enrolledSubjects },
      dayOfWeek,
    })
      .populate('subject', 'name subjectCode')
      .sort({ startTime: 1 });

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        semester: student.semester,
        department: student.department,
      },
      attendance: {
        overall: attendanceData.overallPercentage,
        bySubject: attendanceData.subjectBreakdown,
      },
      marks: {
        overall: marksData.overallPercentage,
        bySubject: marksData.subjectBreakdown,
      },
      riskStatus,
      recentNotices: notices,
      todaysTimetable,
    };
  } catch (error) {
    logger.error('Error getting student dashboard:', error);
    throw error;
  }
};

export const getFacultyDashboard = async (facultyId) => {
  try {
    const faculty = await User.findById(facultyId)
      .populate('department')
      .populate({
        path: 'enrolledSubjects',
        model: 'Subject',
      });

    if (!faculty || faculty.role !== 'faculty') {
      throw new AppError('Faculty not found', HTTP_STATUS.NOT_FOUND);
    }

    // Get assigned subjects
    const assignedSubjects = await Subject.find({
      assignedFaculty: facultyId,
    }).populate('enrolledStudents', 'name email');

    // Get today's schedule
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const todaySchedule = await Timetable.find({
      faculty: facultyId,
      dayOfWeek,
    })
      .populate('subject', 'name subjectCode')
      .sort({ startTime: 1 });

    return {
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      },
      assignedSubjects,
      todaySchedule,
      totalStudents: assignedSubjects.reduce(
        (sum, subject) => sum + subject.enrolledStudents.length,
        0
      ),
    };
  } catch (error) {
    logger.error('Error getting faculty dashboard:', error);
    throw error;
  }
};

export const getAdminDashboard = async () => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalFaculty = await User.countDocuments({ role: 'faculty', isActive: true });
    const totalSubjects = await Subject.countDocuments({ isActive: true });

    // Get students at risk
    const students = await User.find({ role: 'student', isActive: true });
    let atRiskCount = 0;

    for (const student of students) {
      const attendance = await calculateAggregateAttendance(student._id);
      const marks = await calculateAggregateMarks(student._id);
      const risk = calculateRiskStatus(attendance.overallPercentage, marks.overallPercentage);

      if (risk.status === 'RED') {
        atRiskCount += 1;
      }
    }

    return {
      summary: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        atRiskStudents: atRiskCount,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error('Error getting admin dashboard:', error);
    throw error;
  }
};

export const getApplicableNotices = async (userId, role, page = 1, limit = 10) => {
  try {
    const { skip } = getPaginationParams({ page: page.toString(), limit: limit.toString() });

    let query = { isPublished: true };

    if (role === 'student') {
      const user = await User.findById(userId);
      query = {
        $or: [
          { audience: 'global' },
          {
            audience: 'class',
            targetSubject: { $in: user.enrolledSubjects },
          },
          {
            audience: 'department',
            targetDepartment: user.department,
          },
        ],
        isPublished: true,
      };
    } else if (role === 'faculty') {
      query = {
        $or: [
          { audience: 'global' },
          { author: userId },
        ],
        isPublished: true,
      };
    } else if (role === 'admin') {
      query.isPublished = true;
    }

    const notices = await Notice.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Notice.countDocuments(query);

    return {
      notices,
      totalCount,
      page,
      hasMore: skip + limit < totalCount,
    };
  } catch (error) {
    logger.error('Error getting applicable notices:', error);
    throw error;
  }
};
