import Subject from '../models/Subject.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getSubjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { department, semester, faculty, search } = req.query;

  let query = {};

  if (department) query.department = department;
  if (semester) query.semester = parseInt(semester, 10);
  if (faculty) query.assignedFaculty = faculty;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { subjectCode: { $regex: search, $options: 'i' } },
    ];
  }

  const subjects = await Subject.find(query)
    .populate('department', 'name code')
    .populate('assignedFaculty', 'name email')
    .populate('enrolledStudents', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ semester: 1, name: 1 });

  const totalCount = await Subject.countDocuments(query);

  res.json(paginatedResponse(subjects, totalCount, page, limit, 'Subjects fetched'));
});

export const getSubjectById = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const subject = await Subject.findById(subjectId)
    .populate('department', 'name code')
    .populate('assignedFaculty', 'name email')
    .populate('enrolledStudents', 'name email userId');

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  res.json(successResponse(subject, 'Subject fetched successfully'));
});

export const createSubject = asyncHandler(async (req, res) => {
  const { subjectCode, name, description, department, semester, credits } = req.validatedBody;

  // Check if subject already exists
  const existingSubject = await Subject.findOne({ subjectCode });

  if (existingSubject) {
    throw new AppError('Subject with this code already exists', HTTP_STATUS.CONFLICT);
  }

  const subject = await Subject.create({
    subjectCode,
    name,
    description: description || '',
    department,
    semester,
    credits: credits || 3,
  });

  await subject.populate('department', 'name code');

  logger.info(`✅ Subject created: ${name} (${subjectCode})`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(subject, 'Subject created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { name, description, credits, assignedFaculty } = req.validatedBody;

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  if (name) subject.name = name;
  if (description !== undefined) subject.description = description;
  if (credits) subject.credits = credits;
  if (assignedFaculty) subject.assignedFaculty = assignedFaculty;

  await subject.save();

  logger.info(`✅ Subject updated: ${subjectId}`);

  res.json(successResponse(subject, 'Subject updated successfully'));
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const subject = await Subject.findByIdAndDelete(subjectId);

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Subject deleted: ${subjectId}`);

  res.json(successResponse({ id: subjectId }, 'Subject deleted successfully'));
});

export const enrollStudents = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { studentIds } = req.validatedBody;

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  // Add students to enrolledStudents, avoiding duplicates
  studentIds.forEach((studentId) => {
    if (!subject.enrolledStudents.includes(studentId)) {
      subject.enrolledStudents.push(studentId);
    }
  });

  await subject.save();

  logger.info(`✅ ${studentIds.length} students enrolled in subject ${subjectId}`);

  res.json(successResponse(subject, 'Students enrolled successfully'));
});

export const removeStudent = asyncHandler(async (req, res) => {
  const { subjectId, studentId } = req.params;

  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { $pull: { enrolledStudents: studentId } },
    { new: true }
  );

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Student ${studentId} removed from subject ${subjectId}`);

  res.json(successResponse(subject, 'Student removed from subject successfully'));
});

export const assignFaculty = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { facultyId } = req.validatedBody;

  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { assignedFaculty: facultyId },
    { new: true }
  ).populate('assignedFaculty', 'name email');

  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Faculty ${facultyId} assigned to subject ${subjectId}`);

  res.json(successResponse(subject, 'Faculty assigned successfully'));
});
