import Assessment from '../models/Assessment.js';
import * as assessmentService from '../services/assessmentService.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getAssessments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { subjectId, assessmentType, isPublished } = req.query;

  let query = {};

  if (subjectId) query.subject = subjectId;
  if (assessmentType) query.assessmentType = assessmentType;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const assessments = await Assessment.find(query)
    .populate('subject', 'name subjectCode')
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Assessment.countDocuments(query);

  res.json(paginatedResponse(assessments, totalCount, page, limit, 'Assessments fetched'));
});

export const getAssessmentById = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;

  const assessment = await Assessment.findById(assessmentId)
    .populate('subject', 'name subjectCode')
    .populate('createdBy', 'name email')
    .populate('records.student', 'name email userId');

  if (!assessment) {
    throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
  }

  res.json(successResponse(assessment, 'Assessment fetched successfully'));
});

export const createAssessment = asyncHandler(async (req, res) => {
  const { subjectId, title, description, maxMarks, assessmentType, dueDate, records } =
    req.validatedBody;
  const facultyId = req.user.userId;

  const assessment = await Assessment.create({
    subject: subjectId,
    title,
    description: description || '',
    maxMarks,
    assessmentType: assessmentType || 'internal',
    dueDate: dueDate ? new Date(dueDate) : null,
    records: records || [],
    createdBy: facultyId,
  });

  await assessment.populate('subject', 'name subjectCode');

  logger.info(`✅ Assessment created: ${title} for subject ${subjectId}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(assessment, 'Assessment created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const { title, description, maxMarks, assessmentType, dueDate } = req.validatedBody;

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
  }

  if (title) assessment.title = title;
  if (description !== undefined) assessment.description = description;
  if (maxMarks) assessment.maxMarks = maxMarks;
  if (assessmentType) assessment.assessmentType = assessmentType;
  if (dueDate) assessment.dueDate = new Date(dueDate);

  await assessment.save();

  logger.info(`✅ Assessment updated: ${assessmentId}`);

  res.json(successResponse(assessment, 'Assessment updated successfully'));
});

export const submitMarks = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const { records } = req.validatedBody;

  // Validate marks
  await assessmentService.validateMarksSubmission(assessmentId, records);

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
  }

  // Update marks for each student
  records.forEach((newRecord) => {
    const existingRecord = assessment.records.find(
      (r) => r.student.toString() === newRecord.student
    );

    if (existingRecord) {
      existingRecord.marksObtained = newRecord.marksObtained;
      if (newRecord.remarks) existingRecord.remarks = newRecord.remarks;
    } else {
      assessment.records.push(newRecord);
    }
  });

  await assessment.save();

  logger.info(`✅ Marks submitted for assessment ${assessmentId}`);

  res.json(successResponse(assessment, 'Marks submitted successfully'));
});

export const publishAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;

  const assessment = await Assessment.findByIdAndUpdate(
    assessmentId,
    { isPublished: true },
    { new: true }
  );

  if (!assessment) {
    throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Assessment published: ${assessmentId}`);

  res.json(successResponse(assessment, 'Assessment published successfully'));
});

export const deleteAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;

  const assessment = await Assessment.findByIdAndDelete(assessmentId);

  if (!assessment) {
    throw new AppError('Assessment not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Assessment deleted: ${assessmentId}`);

  res.json(successResponse({ id: assessmentId }, 'Assessment deleted successfully'));
});

export const getStudentMarks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const marksData = await assessmentService.calculateAggregateMarks(studentId);

  res.json(successResponse(marksData, 'Student marks fetched successfully'));
});
