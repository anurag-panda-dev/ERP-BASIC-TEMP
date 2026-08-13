import Timetable from '../models/Timetable.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getTimetable = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { subject, semester, academicYear, dayOfWeek } = req.query;

  let query = {};

  if (subject) query.subject = subject;
  if (semester) query.semester = parseInt(semester, 10);
  if (academicYear) query.academicYear = academicYear;
  if (dayOfWeek) query.dayOfWeek = dayOfWeek;

  const timetables = await Timetable.find(query)
    .populate('subject', 'name subjectCode')
    .populate('faculty', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ dayOfWeek: 1, startTime: 1 });

  const totalCount = await Timetable.countDocuments(query);

  res.json(paginatedResponse(timetables, totalCount, page, limit, 'Timetables fetched'));
});

export const getTimetableById = asyncHandler(async (req, res) => {
  const { timetableId } = req.params;

  const timetable = await Timetable.findById(timetableId)
    .populate('subject', 'name subjectCode')
    .populate('faculty', 'name email');

  if (!timetable) {
    throw new AppError('Timetable not found', HTTP_STATUS.NOT_FOUND);
  }

  res.json(successResponse(timetable, 'Timetable fetched successfully'));
});

export const createTimetable = asyncHandler(async (req, res) => {
  const {
    subject,
    dayOfWeek,
    startTime,
    endTime,
    classroom,
    semester,
    academicYear,
    faculty,
  } = req.body;

  const timetable = await Timetable.create({
    subject,
    dayOfWeek,
    startTime,
    endTime,
    classroom,
    semester,
    academicYear,
    faculty: faculty || null,
  });

  await timetable.populate('subject', 'name subjectCode').populate('faculty', 'name email');

  logger.info(`✅ Timetable entry created for ${dayOfWeek} ${startTime}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(timetable, 'Timetable created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateTimetable = asyncHandler(async (req, res) => {
  const { timetableId } = req.params;
  const { startTime, endTime, classroom, faculty } = req.body;

  const timetable = await Timetable.findById(timetableId);

  if (!timetable) {
    throw new AppError('Timetable not found', HTTP_STATUS.NOT_FOUND);
  }

  if (startTime) timetable.startTime = startTime;
  if (endTime) timetable.endTime = endTime;
  if (classroom) timetable.classroom = classroom;
  if (faculty) timetable.faculty = faculty;

  await timetable.save();

  logger.info(`✅ Timetable updated: ${timetableId}`);

  res.json(successResponse(timetable, 'Timetable updated successfully'));
});

export const deleteTimetable = asyncHandler(async (req, res) => {
  const { timetableId } = req.params;

  const timetable = await Timetable.findByIdAndDelete(timetableId);

  if (!timetable) {
    throw new AppError('Timetable not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Timetable deleted: ${timetableId}`);

  res.json(successResponse({ id: timetableId }, 'Timetable deleted successfully'));
});

export const getTimetableBySubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const timetables = await Timetable.find({ subject: subjectId })
    .populate('subject', 'name subjectCode')
    .populate('faculty', 'name email')
    .sort({ dayOfWeek: 1, startTime: 1 });

  res.json(successResponse(timetables, 'Subject timetable fetched successfully'));
});

export const getTodaysTimetable = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  let query = { dayOfWeek };
  if (subjectId) query.subject = subjectId;

  const timetables = await Timetable.find(query)
    .populate('subject', 'name subjectCode')
    .populate('faculty', 'name email')
    .sort({ startTime: 1 });

  res.json(successResponse(timetables, `Today's (${dayOfWeek}) timetable fetched successfully`));
});
