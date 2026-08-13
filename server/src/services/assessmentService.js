import Assessment from '../models/Assessment.js';
import Subject from '../models/Subject.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

export const calculateMarksPercentage = async (studentId, subjectId) => {
  try {
    const assessments = await Assessment.find({
      subject: subjectId,
      isPublished: true,
    });

    if (assessments.length === 0) {
      return {
        percentage: 0,
        totalMarks: 0,
        maxMarks: 0,
        breakdown: [],
      };
    }

    let totalMarks = 0;
    let maxMarks = 0;
    const breakdown = [];

    assessments.forEach((assessment) => {
      const studentRecord = assessment.records.find(
        (r) => r.student.toString() === studentId
      );

      if (studentRecord) {
        totalMarks += studentRecord.marksObtained;
        maxMarks += assessment.maxMarks;

        breakdown.push({
          title: assessment.title,
          marksObtained: studentRecord.marksObtained,
          maxMarks: assessment.maxMarks,
          percentage:
            assessment.maxMarks > 0
              ? Math.round((studentRecord.marksObtained / assessment.maxMarks) * 100 * 10) /
                10
              : 0,
          type: assessment.assessmentType,
        });
      }
    });

    const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100 * 10) / 10 : 0;

    return {
      percentage,
      totalMarks,
      maxMarks,
      breakdown,
    };
  } catch (error) {
    logger.error('Error calculating marks percentage:', error);
    throw new AppError(
      'Failed to calculate marks',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const calculateAggregateMarks = async (studentId) => {
  try {
    // Get all subjects the student is enrolled in
    const subjects = await Subject.find({
      enrolledStudents: studentId,
    });

    if (subjects.length === 0) {
      return {
        overallPercentage: 0,
        totalMarks: 0,
        maxMarks: 0,
        subjectBreakdown: [],
      };
    }

    const subjectBreakdown = [];
    let totalAllMarks = 0;
    let totalAllMaxMarks = 0;

    for (const subject of subjects) {
      const marks = await calculateMarksPercentage(studentId, subject._id);

      subjectBreakdown.push({
        subject: subject.name,
        subjectId: subject._id,
        percentage: marks.percentage,
        totalMarks: marks.totalMarks,
        maxMarks: marks.maxMarks,
      });

      totalAllMarks += marks.totalMarks;
      totalAllMaxMarks += marks.maxMarks;
    }

    const overallPercentage =
      totalAllMaxMarks > 0
        ? Math.round((totalAllMarks / totalAllMaxMarks) * 100 * 10) / 10
        : 0;

    return {
      overallPercentage,
      totalMarks: totalAllMarks,
      maxMarks: totalAllMaxMarks,
      subjectBreakdown,
    };
  } catch (error) {
    logger.error('Error calculating aggregate marks:', error);
    throw error;
  }
};

export const validateMarksSubmission = async (assessmentId, records) => {
  try {
    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
    }

    for (const record of records) {
      if (record.marksObtained < 0 || record.marksObtained > assessment.maxMarks) {
        throw new AppError(
          `Marks must be between 0 and ${assessment.maxMarks}`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    return true;
  } catch (error) {
    logger.error('Error validating marks submission:', error);
    throw error;
  }
};
