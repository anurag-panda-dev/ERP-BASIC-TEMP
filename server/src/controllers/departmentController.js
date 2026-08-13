import Department from '../models/Department.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getDepartments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { search } = req.query;

  let query = { };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  const departments = await Department.find(query)
    .populate('hod', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Department.countDocuments(query);

  res.json(paginatedResponse(departments, totalCount, page, limit, 'Departments fetched'));
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const department = await Department.findById(departmentId).populate('hod', 'name email');

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  res.json(successResponse(department, 'Department fetched successfully'));
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, description } = req.validatedBody;

  // Check if department already exists
  const existingDept = await Department.findOne({
    $or: [{ name }, { code }],
  });

  if (existingDept) {
    throw new AppError('Department with this name or code already exists', HTTP_STATUS.CONFLICT);
  }

  const department = await Department.create({
    name,
    code,
    description: description || '',
  });

  logger.info(`✅ Department created: ${name}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(department, 'Department created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { name, code, description, hod } = req.validatedBody;

  const department = await Department.findById(departmentId);

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check for name/code duplication
  if (name && name !== department.name) {
    const existing = await Department.findOne({ name });
    if (existing) throw new AppError('Department name already in use', HTTP_STATUS.CONFLICT);
  }

  if (code && code !== department.code) {
    const existing = await Department.findOne({ code });
    if (existing) throw new AppError('Department code already in use', HTTP_STATUS.CONFLICT);
  }

  if (name) department.name = name;
  if (code) department.code = code;
  if (description !== undefined) department.description = description;
  if (hod) department.hod = hod;

  await department.save();

  logger.info(`✅ Department updated: ${departmentId}`);

  res.json(successResponse(department, 'Department updated successfully'));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const department = await Department.findByIdAndDelete(departmentId);

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ Department deleted: ${departmentId}`);

  res.json(successResponse({ id: departmentId }, 'Department deleted successfully'));
});
