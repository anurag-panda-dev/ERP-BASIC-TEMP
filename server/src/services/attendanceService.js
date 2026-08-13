import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

export const calculateAttendancePercentage = async (studentId, subjectId) => {
  try {
    const records = await Attendance.find({
      subject: subjectId,
      'records.student': studentId,
    });

    if (records.length === 0) {
      return {
        percentage: 0,
        present: 0,
        total: 0,
      };
    }

    let presentCount = 0;
    records.forEach((record) => {
      const studentRecord = record.records.find(
        (r) => r.student.toString() === studentId
      );
      if (studentRecord && studentRecord.status === 'Present') {
        presentCount += 1;
      }
    });

    const percentage = records.length > 0 ? (presentCount / records.length) * 100 : 0;

    return {
      percentage: Math.round(percentage * 10) / 10,
      present: presentCount,
      total: records.length,
    };
  } catch (error) {
    logger.error('Error calculating attendance percentage:', error);
    throw new AppError(
      'Failed to calculate attendance',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const calculateAggregateAttendance = async (studentId) => {
  try {
    // Get all subjects the student is enrolled in
    const subjects = await Subject.find({
      enrolledStudents: studentId,
    });

    if (subjects.length === 0) {
      return {
        overallPercentage: 0,
        subjectBreakdown: [],
      };
    }

    const subjectBreakdown = [];
    let totalPercentage = 0;

    for (const subject of subjects) {
      const attendance = await calculateAttendancePercentage(studentId, subject._id);
      subjectBreakdown.push({
        subject: subject.name,
        subjectId: subject._id,
        percentage: attendance.percentage,
        present: attendance.present,
        total: attendance.total,
      });
      totalPercentage += attendance.percentage;
    }

    const overallPercentage =
      subjectBreakdown.length > 0
        ? Math.round((totalPercentage / subjectBreakdown.length) * 10) / 10
        : 0;

    return {
      overallPercentage,
      subjectBreakdown,
    };
  } catch (error) {
    logger.error('Error calculating aggregate attendance:', error);
    throw error;
  }
};

export const validateAttendanceSubmission = async (subjectId, records) => {
  try {
    // Fetch subject and check if all students are enrolled
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
    }

    const enrolledStudentIds = subject.enrolledStudents.map((id) => id.toString());

    for (const record of records) {
      if (!enrolledStudentIds.includes(record.student)) {
        throw new AppError(
          `Student ${record.student} is not enrolled in this subject`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (!['Present', 'Absent'].includes(record.status)) {
        throw new AppError('Invalid attendance status', HTTP_STATUS.BAD_REQUEST);
      }
    }

    return true;
  } catch (error) {
    logger.error('Error validating attendance submission:', error);
    throw error;
  }
};
