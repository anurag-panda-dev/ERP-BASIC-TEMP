import Attendance from '../models/Attendance.js';
import * as attendanceService from '../services/attendanceService.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getAttendance = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { subjectId, date, studentId } = req.query;

  let query = {};

  if (subjectId) query.subject = subjectId;
  if (date) query.date = new Date(date);
  if (studentId) query['records.student'] = studentId;

  const records = await Attendance.find(query)
    .populate('subject', 'name subjectCode')
    .populate('records.student', 'name email userId')
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 });

  const totalCount = await Attendance.countDocuments(query);

  res.json(paginatedResponse(records, totalCount, page, limit, 'Attendance records fetched'));
});

export const submitAttendance = asyncHandler(async (req, res) => {
  const { subjectId, date, records } = req.validatedBody;
  const facultyId = req.user.userId;

  // Validate attendance submission
  await attendanceService.validateAttendanceSubmission(subjectId, records);

  // Check if attendance already exists for this date
  let attendance = await Attendance.findOne({
    subject: subjectId,
    date: new Date(date),
  });

  if (attendance) {
    // Update existing attendance
    attendance.records = records;
    attendance.updatedAt = new Date();
  } else {
    // Create new attendance
    attendance = await Attendance.create({
      subject: subjectId,
      date: new Date(date),
      records,
      createdBy: facultyId,
    });
  }

  await attendance.save();

  logger.info(`✅ Attendance submitted for subject ${subjectId} on ${date}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(attendance, 'Attendance submitted successfully', HTTP_STATUS.CREATED)
  );
});

export const getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const attendanceData = await attendanceService.calculateAggregateAttendance(studentId);

  res.json(successResponse(attendanceData, 'Student attendance fetched successfully'));
});

export const getSubjectAttendance = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query);

  const records = await Attendance.find({ subject: subjectId })
    .populate('subject', 'name subjectCode')
    .populate('records.student', 'name email userId')
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 });

  const totalCount = await Attendance.countDocuments({ subject: subjectId });

  res.json(
    paginatedResponse(records, totalCount, page, limit, 'Subject attendance records fetched')
  );
});

export const getAttendanceByDateRange = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate, subjectId } = req.query;

  let query = {
    'records.student': studentId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  if (subjectId) query.subject = subjectId;

  const records = await Attendance.find(query)
    .populate('subject', 'name subjectCode')
    .sort({ date: -1 });

  res.json(successResponse(records, 'Attendance records fetched by date range'));
});
